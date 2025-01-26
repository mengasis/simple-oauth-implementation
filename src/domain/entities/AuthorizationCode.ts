export class AuthorizationCode {
    constructor(
      public code: string,
      public clientId: string,
      public userId: string,
      public redirectUri: string,
      public scopes: string[],
      public expiresAt: number
    ) {}
  }