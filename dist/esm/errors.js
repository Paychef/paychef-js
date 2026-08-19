/**
 * Error thrown for any failed PayChef API request.
 */
export class PayChefError extends Error {
    constructor(message, statusCode = 0, reason) {
        super(message);
        this.name = 'PayChefError';
        this.statusCode = statusCode;
        this.reason = reason;
    }
}
