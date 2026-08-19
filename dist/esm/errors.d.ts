/**
 * Error thrown for any failed PayChef API request.
 */
export declare class PayChefError extends Error {
    /** HTTP status code returned by the API (0 for network errors). */
    readonly statusCode: number;
    /** Machine-readable reason provided by the API, if any. */
    readonly reason?: string;
    constructor(message: string, statusCode?: number, reason?: string);
}
