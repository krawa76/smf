import * as util from "util";
import * as winston from "winston";
import { createLogger, format, transports } from "winston";

import config from '../config';


const { combine, timestamp, printf } = format;

export class Logger {
  public static customLogger = Logger.getLogger();

  private static getLogger(): winston.Logger {
    return createLogger({
      exitOnError: false,
      level: config.LOG_LEVEL,
      transports: [
        new transports.Console({
          format: combine(
            timestamp(),
            printf((info) => {
              return `${info.timestamp} [${info.level}]: ${info.message} <==KAZUHM-LOG-END==>`;
            }),
          ),
          handleExceptions: true,
        }),
      ],
    });
  }

  // tslint:disable-next-line:member-ordering
  public static formatArgs(args: string[]) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
  }

  // tslint:disable-next-line:member-ordering
  public static debug(...args: string[]) {
    Logger.customLogger.debug.apply(Logger.customLogger, Logger.formatArgs(args));
  }

  // tslint:disable-next-line:member-ordering
  public static info(...args: string[]) {
    Logger.customLogger.info.apply(Logger.customLogger, Logger.formatArgs(args));
  }

  // tslint:disable-next-line:member-ordering
  public static warn(...args: string[]) {
    args.push(Logger.getFile());
    Logger.customLogger.warn.apply(Logger.customLogger, Logger.formatArgs(args));
  }

  // tslint:disable-next-line:member-ordering
  public static error(...args: any[]) {
    args.push(Logger.getFile());
    Logger.customLogger.error.apply(Logger.customLogger, Logger.formatArgs(args));
  }

  // tslint:disable-next-line:member-ordering
  public static getFile(): string {
    // Create mock error to get current file
    const err = new Error().stack;
    if (err) {
      const split = err.split(/\r|\n/);
      if (split.length > 3) {
        // Get current file's name
        const line = split[3].split("\\").pop();
        if (line) {
          // Remove trailing ) bracket
          return line.substr(0, line.length - 1);
        }
      }
    }
    return "";
  }
}
