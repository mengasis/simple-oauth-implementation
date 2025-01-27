import type { Logger } from '../../domain/ports/Logger';

export class ConsoleLogger implements Logger {
  info(message: string, context?: string): void {
    console.log(`[INFO] ${this.formatContext(context)}${message}`);
  }

  warn(message: string, context?: string): void {
    console.warn(`[WARN] ${this.formatContext(context)}${message}`);
  }

  error(message: string | Error, context?: string): void {
    const errorMessage =
      message instanceof Error ? message.stack || message.message : message;
    console.error(`[ERROR] ${this.formatContext(context)}${errorMessage}`);
  }

  debug(message: string, context?: string): void {
    console.debug(`[DEBUG] ${this.formatContext(context)}${message}`);
  }

  private formatContext(context?: string): string {
    return context ? `[${context}] ` : '';
  }
}
