export default class CodedError extends Error {
  private _statusCode: number;
  public constructor(message: string, code?: number) {
    super(message);
    this._statusCode = code ?? 500;
  }

  public get statusCode(): number {
    return this._statusCode;
  }
}
