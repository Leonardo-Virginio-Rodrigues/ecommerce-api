export class AppError extends Error {
  constructor(
    public readonly errorKey: string,
    public readonly statusCode: number,
    public readonly friendlyMessage: string
  ) {
    super(friendlyMessage);
    this.name = "AppError";
  }
}
