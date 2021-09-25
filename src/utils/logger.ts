import { writeFile } from 'fs/promises';
import { createLogger, format } from 'winston';
import {
  Console,
  ConsoleTransportOptions,
  File,
  FileTransportOptions,
} from 'winston/lib/winston/transports';
const { cli, timestamp, ms, json, combine } = format;

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

const FileOption: FileTransportOptions = {
  silent: true,
  level: LogLevel.verbose,
  dirname: './logs',
  filename: `verbose.log`,
  format: format.combine(timestamp(), ms(), json({ space: 2 })),
};

const consoleOption: ConsoleTransportOptions = {
  silent: false,
  level: LogLevel.silly,
  format: cli({ all: true }),
};

export const logger = createLogger({
  transports: [new Console(consoleOption)],
});

export const { error, warn, info, http, verbose, debug, silly, log } = logger;

export default logger;

export const outputToFile = (filename: string, value: any) =>
  typeof value === 'object'
    ? writeFile(
        filename.endsWith('.json') ? filename : filename + '.json',
        JSON.stringify(value, undefined, 2)
      )
    : writeFile(
        filename.endsWith('.txt') ? filename : filename + '.txt',
        value
      );

// process.on('uncaughtException', (error, origin) => {
//   const Filename = `error.${Date.now()}.json`;
//   outputToFile(Filename, error);
//   logger.error(
//     `Uncaught Exceptions: ${error.message}, Object output to: ${Filename}`
//   );
//   process.exit();
// });
