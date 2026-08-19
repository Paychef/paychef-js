/**
 * Error thrown for any failed PayChef API request.
 */
export class PayChefError extends Error {
  /** HTTP status code returned by the API (0 for network errors). */
  readonly statusCode: number;
  /** Machine-readable reason provided by the API, if any. */
  readonly reason?: string;

  constructor(message: string, statusCode = 0, reason?: string) {
    super(message);
    this.name = 'PayChefError';
    this.statusCode = statusCode;
    this.reason = reason;
  }
}
