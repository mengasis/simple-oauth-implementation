export interface Logger {
  info(message: string, context?: string): void;
  warn(message: string, context?: string): void;
  error(message: string | Error, context?: string): void;
  debug(message: string, context?: string): void;
} 