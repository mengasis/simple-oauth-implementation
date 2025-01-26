export class Client {
  constructor(
    public readonly id: string,
    public readonly secret: string,
    public readonly name: string,
    public readonly redirectUris: string[],
    public readonly grantTypes: string[],
    public readonly scopes: string[]
  ) {}

  static create(
    name: string,
    redirectUris: string[],
    grantTypes: string[],
    scopes: string[]
  ): Client {
    return new Client(
      crypto.randomUUID(),
      crypto.randomUUID(),
      name,
      redirectUris,
      grantTypes,
      scopes
    );
  }
}
