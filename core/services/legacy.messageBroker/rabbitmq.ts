import * as amqp from "amqplib";
import * as fs from "fs";
import config from "../../legacy.config";
import { Logger } from "../logger";

export const EXCHANGE_ASSIGNATION = "assignation";
export const KEY_ASSIGNATION_CREATED = "assignation.event.created";
export const QUEUE_ASSIGNATIONS_CREATED = "assignations-created";
export const EXCHANGE_CLIENT = "client";
export const KEY_CLIENT_OFF = "client.event.off";
export const KEY_CLIENT_ON = "client.event.on";
export const QUEUE_CLIENT_OFF = "clients-off";
export const QUEUE_CLIENT_ON = "clients-on";

export async function getConnection() {
  const connection = await amqp.connect(
    config.RABBITMQ_URL,
    {
      ca: config.RABBITMQ_SSL_CACERTFILE ? [fs.readFileSync(config.RABBITMQ_SSL_CACERTFILE)] : undefined,
      cert: config.RABBITMQ_SSL_CERTFILE ? fs.readFileSync(config.RABBITMQ_SSL_CERTFILE) : undefined,
      key: config.RABBITMQ_SSL_KEYFILE ? fs.readFileSync(config.RABBITMQ_SSL_KEYFILE) : undefined,
      passphrase: config.RABBITMQ_SSL_PASSPHRASE ? config.RABBITMQ_SSL_PASSPHRASE : undefined,
    },
  );
  Logger.info("Connected to RabbitMQ");
  connection.on("error", (error) => {
    Logger.error("RabbitMQ connection with error, exiting", error);
    process.exit(1);
  });
  connection.on("close", (error) => {
    Logger.error("RabbitMQ connection closed, exiting");
    process.exit(1);
  });
  process.on("SIGINT", () => {
    Logger.info("SIGINT: RabbitMQ: closing the connection...");
    connection.close();
  });

  return connection;
}
