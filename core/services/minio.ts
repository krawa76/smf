import minio = require("minio");
import querystring = require("querystring");
import url = require("url");
import config from "../config";
import { Logger } from "./logger";

export let endPoint = "10.12.0.127";
export let port = 9000;

import { format, parse, UrlWithStringQuery } from "url";

interface IMinioConfig {
    accessKey: string;
    secretKey: string;
    endPoint: string;
    port: number;
    useSSL: boolean;
}

// Helpers

let baseParts: UrlWithStringQuery;

if (config.MINIO_PUBLIC_HOST) {
    baseParts = parse(config.MINIO_PUBLIC_HOST);
}

//================================================================================

export default class Minio {
  public bucket = config.MINIO_BUCKET;
  public installerBucket = config.MINIO_INSTALLER_BUCKET;
  public awsKeyBucket = config.MINIO_AWS_KEY_BUCKET;

  public config;
  public client;
  
  constructor() {
    this.config = this.createConfig(config.MINIO_URI);
  }

  public init() {
    const minioClient = new minio.Client(this.config);
    Logger.info("Initialized Minio");
    
    // @TODO move to health container
    (async () => {
        if (!(await minioClient.bucketExists(this.installerBucket))) {
            await minioClient.makeBucket(this.installerBucket, config.MINIO_REGION);
        }
        if (!(await minioClient.bucketExists(this.awsKeyBucket))) {
            await minioClient.makeBucket(this.awsKeyBucket, config.MINIO_REGION);
        }
    })();  
  }

  private createConfig(minioUrl: string): IMinioConfig {
    let useSSL = false;
    let accessKey: string;
    let secretKey: string;

    const localConfig = url.parse(minioUrl);
    endPoint = localConfig.hostname;
    if (localConfig.port) {
        port = Number(localConfig.port);
    }
    if (localConfig.protocol === "https:") {
        useSSL = true;
    }
    if (localConfig.query) {
        const query = querystring.parse(localConfig.query as any);
        if (query.accessKey) {
            accessKey = (query.accessKey as string).replace(/\s+/g, "+");
        }
        if (query.secretKey) {
            secretKey = (query.secretKey as string).replace(/\s+/g, "+");
        }
    }

    return {
        accessKey,
        endPoint,
        port,
        secretKey,
        useSSL,
    };
  }

  public domainReplace(link: string) {
    const parts = parse(link);

    if (baseParts) {
        parts.host = baseParts.host;
        parts.protocol = baseParts.protocol;
    }

    return format(parts);
  }
}