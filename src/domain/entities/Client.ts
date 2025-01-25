export class Client {
  constructor(
    public id: string,
    public secret: string,
    public redirectUris: string[],
    public scopes: string[],
    public isConfidential = true,
  ) {}
}
