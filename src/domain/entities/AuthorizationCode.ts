export class AuthorizationCode {
    constructor(
      public code: string,
      public clientId: string,
      public userId: string,
      public redirectUri: string,
      public scopes: string[],
      public expiresAt: number
    ) {}

    static create(
      clientId: string,
      userId: string,
      redirectUri: string,
      scopes: string[]
    ): AuthorizationCode {
      return new AuthorizationCode(
        crypto.randomUUID(), // Generate a new code
        clientId,
        userId,
        redirectUri,
        scopes,
        Date.now() + 5 * 60 * 1000 // Set expiration time
      );
    }
  }