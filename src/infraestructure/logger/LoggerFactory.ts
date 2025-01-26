import type { Logger } from '../../domain/ports/Logger';
import { ConsoleLogger } from './ConsoleLogger';

export class LoggerFactory {
  private constructor() {} // Prevent instantiation

  private static instance: Logger = new ConsoleLogger();

  static getLogger(): Logger {
    return LoggerFactory.instance;
  }

  static setLogger(logger: Logger): void {
    LoggerFactory.instance = logger;
  }
}
