export abstract class Model extends Object {
  constructor(
    public id: number | null = null,
    public creationDate: Date = new Date()
  ) {
    super();
  }

  asCreateDao?(): object | null;

  static fromGetDao?(dao: Record<string, unknown> | null): Model | null;

  override toString(): string {
    return this.id?.toString() ?? '';
  }
}
