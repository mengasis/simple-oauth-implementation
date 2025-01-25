export class Token {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public clientId: string,
    public scopes: string[],
    public expiresIn: number,
  ) {}
}
