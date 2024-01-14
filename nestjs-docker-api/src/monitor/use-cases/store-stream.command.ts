export class StoreStreamCommand {
  constructor(
    public readonly content: string,
    public readonly timestamp: Date,
  ) {}
}
