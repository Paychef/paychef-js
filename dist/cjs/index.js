"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayChef = exports.CLIENT_VERSION = exports.DEFAULT_API_VERSION = exports.API_URL_BASE_DOMAIN = exports.PayChefError = void 0;
const http_js_1 = require("./http.js");
const errors_js_1 = require("./errors.js");
__exportStar(require("./types.js"), exports);
var errors_js_2 = require("./errors.js");
Object.defineProperty(exports, "PayChefError", { enumerable: true, get: function () { return errors_js_2.PayChefError; } });
var http_js_2 = require("./http.js");
Object.defineProperty(exports, "API_URL_BASE_DOMAIN", { enumerable: true, get: function () { return http_js_2.API_URL_BASE_DOMAIN; } });
Object.defineProperty(exports, "DEFAULT_API_VERSION", { enumerable: true, get: function () { return http_js_2.DEFAULT_API_VERSION; } });
Object.defineProperty(exports, "CLIENT_VERSION", { enumerable: true, get: function () { return http_js_2.CLIENT_VERSION; } });
/** Unwraps single-object responses that the API may wrap in an array. */
function single(data) {
    return (Array.isArray(data) ? data[0] : data);
}
function list(data) {
    return (Array.isArray(data) ? data : [data]);
}
/**
 * PayChef API client.
 *
 * ```ts
 * import { PayChef } from 'paychef';
 *
 * const paychef = new PayChef({ instance: 'demo', apiSecret: '...' });
 * const gateway = await paychef.gateway.create({ amount: 1000, currency: 'CHF' });
 * console.log(gateway.link); // redirect your customer here
 * ```
 */
class PayChef {
    constructor(options) {
        /** Payment gateways: create a checkout and redirect the customer to `link`. */
        this.gateway = {
            create: async (params) => single(await this.transport.request('Gateway', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('Gateway', 'GET', id)),
            delete: async (id) => single(await this.transport.request('Gateway', 'DELETE', id)),
        };
        /** Transactions: retrieve, list, charge, refund, capture, pre-authorize. */
        this.transaction = {
            retrieve: async (id) => single(await this.transport.request('Transaction', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Transaction', 'GET', 0, '', params)),
            /** Charge a pre-authorized/tokenized transaction. */
            charge: async (id, params) => single(await this.transport.request('Transaction', 'POST', id, '', params)),
            refund: async (id, params = {}) => single(await this.transport.request('Transaction', 'POST', id, 'refund', params)),
            capture: async (id, params = {}) => single(await this.transport.request('Transaction', 'POST', id, 'capture', params)),
            receipt: async (id, params = {}) => single(await this.transport.request('Transaction', 'POST', id, 'receipt', params)),
            preAuthorize: async (params) => single(await this.transport.request('Transaction', 'POST', 0, 'preAuthorize', params)),
            cancel: async (id) => single(await this.transport.request('Transaction', 'DELETE', id)),
        };
        /** Subscriptions. */
        this.subscription = {
            retrieve: async (id) => single(await this.transport.request('Subscription', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Subscription', 'GET', 0, '', params)),
            create: async (params) => single(await this.transport.request('Subscription', 'POST', 0, '', params)),
            update: async (id, params) => single(await this.transport.request('Subscription', 'PUT', id, '', params)),
            cancel: async (id) => single(await this.transport.request('Subscription', 'DELETE', id)),
        };
        /** Invoices (hosted one-off payment requests). */
        this.invoice = {
            create: async (params) => single(await this.transport.request('Invoice', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('Invoice', 'GET', id)),
            delete: async (id) => single(await this.transport.request('Invoice', 'DELETE', id)),
        };
        /** Paylinks / payment pages. */
        this.page = {
            create: async (params) => single(await this.transport.request('Page', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('Page', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Page', 'GET', 0, '', params)),
            delete: async (id) => single(await this.transport.request('Page', 'DELETE', id)),
        };
        /** Payment page designs. */
        this.design = {
            create: async (params) => single(await this.transport.request('Design', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('Design', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Design', 'GET', 0, '', params)),
            // The API expects POST (not PUT) for design updates.
            update: async (id, params) => single(await this.transport.request('Design', 'POST', id, '', params)),
            delete: async (id) => single(await this.transport.request('Design', 'DELETE', id)),
        };
        /** Payouts. */
        this.payout = {
            retrieve: async (id) => single(await this.transport.request('Payout', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Payout', 'GET', 0, '', params)),
            details: async (id, params = {}) => single(await this.transport.request('Payout', 'GET', id, 'details', params)),
        };
        /** Available payment methods. */
        this.paymentMethod = {
            retrieve: async (id) => single(await this.transport.request('PaymentMethod', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('PaymentMethod', 'GET', 0, '', params)),
        };
        /** Configured payment providers. */
        this.paymentProvider = {
            list: async (params = {}) => list(await this.transport.request('PaymentProvider', 'GET', 0, '', params)),
        };
        /** QR codes. */
        this.qrCode = {
            create: async (params) => single(await this.transport.request('QrCode', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('QrCode', 'GET', id)),
            delete: async (id) => single(await this.transport.request('QrCode', 'DELETE', id)),
        };
        /** Bills. */
        this.bill = {
            create: async (params) => single(await this.transport.request('Bill', 'POST', 0, '', params)),
            retrieve: async (id) => single(await this.transport.request('Bill', 'GET', id)),
            list: async (params = {}) => list(await this.transport.request('Bill', 'GET', 0, '', params)),
            update: async (id, params) => single(await this.transport.request('Bill', 'PUT', id, '', params)),
            delete: async (id) => single(await this.transport.request('Bill', 'DELETE', id)),
        };
        /** Signature check: verify instance name and API secret. */
        this.signatureCheck = {
            retrieve: async () => single(await this.transport.request('SignatureCheck', 'GET', 0)),
        };
        /** One-time auth tokens for dashboard auto-login. */
        this.authToken = {
            create: async (params = {}) => single(await this.transport.request('AuthToken', 'POST', 0, '', params)),
        };
        /** ECR (payment terminal) integration. */
        this.ecr = {
            pair: async (id, params = {}) => single(await this.transport.request('EcrPairing', 'POST', id, 'pair', params)),
            unpair: async (id) => single(await this.transport.request('EcrPairing', 'DELETE', id, 'pair')),
            payment: async (id, params) => single(await this.transport.request('EcrPayment', 'POST', id, 'payment', params)),
            cancelPayment: async (id, params = {}) => single(await this.transport.request('EcrPayment', 'POST', id, 'cancel', params)),
            voidPayment: async (id, params = {}) => single(await this.transport.request('EcrPayment', 'POST', id, 'void', params)),
            getPayment: async (id) => single(await this.transport.request('EcrPayment', 'GET', id)),
            getPaymentMethods: async (id) => single(await this.transport.request('EcrPayment', 'GET', id, 'paymentMethods')),
        };
        if (!options?.instance || !options?.apiSecret) {
            throw new errors_js_1.PayChefError('PayChef: instance and apiSecret are required');
        }
        this.transport = new http_js_1.Transport({
            instance: options.instance,
            apiSecret: options.apiSecret,
            apiBaseDomain: options.apiBaseDomain ?? http_js_1.API_URL_BASE_DOMAIN,
            version: options.version ?? http_js_1.DEFAULT_API_VERSION,
            timeout: options.timeout ?? 20000,
            fetch: options.fetch,
        });
    }
    /** The API version this client talks to. */
    get version() {
        return this.transport.version;
    }
}
exports.PayChef = PayChef;
exports.default = PayChef;
