"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayChefError = void 0;
/**
 * Error thrown for any failed PayChef API request.
 */
class PayChefError extends Error {
    constructor(message, statusCode = 0, reason) {
        super(message);
        this.name = 'PayChefError';
        this.statusCode = statusCode;
        this.reason = reason;
    }
}
exports.PayChefError = PayChefError;
