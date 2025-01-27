export class BaseException extends Error {
  public readonly statusCode: number;
  public readonly data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string, data?: unknown) {
    super(message, 400, data);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message: string) {
    super(message, 500);
  }
}
