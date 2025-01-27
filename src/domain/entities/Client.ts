export class Client {
  constructor(
    public readonly id: string,
    public readonly secret: string,
    public readonly name: string,
    public readonly redirect_uris: string[],
    public readonly grant_types: string[],
    public readonly scopes: string[]
  ) {}

  static create(
    name: string,
    redirect_uris: string[],
    grant_types: string[],
    scopes: string[]
  ): Client {
    return new Client(
      crypto.randomUUID(),
      crypto.randomUUID(),
      name,
      redirect_uris,
      grant_types,
      scopes
    );
  }
}
