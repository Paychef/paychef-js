import type { AuthToken, Bill, Design, Gateway, GatewayCreateParams, Invoice, InvoiceCreateParams, Page, PaymentMethod, PaymentProvider, Payout, QrCode, SignatureCheck, Subscription, SubscriptionUpdateParams, Transaction, TransactionChargeParams, TransactionListParams, TransactionRefundParams } from './types.js';
export * from './types.js';
export { PayChefError } from './errors.js';
export { API_URL_BASE_DOMAIN, DEFAULT_API_VERSION, CLIENT_VERSION } from './http.js';
export interface PayChefOptions {
    /**
     * Your instance name, i.e. the subdomain part of your PayChef URL.
     * For https://demo.paychef.com the instance is 'demo'.
     */
    instance: string;
    /** The API secret from your PayChef instance admin panel. */
    apiSecret: string;
    /** API base domain. Defaults to 'paychef.com'. */
    apiBaseDomain?: string;
    /** API version to use. Defaults to '1.15'. */
    version?: string;
    /** Request timeout in milliseconds. Defaults to 20000. */
    timeout?: number;
    /** Custom fetch implementation (e.g. for testing). */
    fetch?: typeof fetch;
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
export declare class PayChef {
    private readonly transport;
    constructor(options: PayChefOptions);
    /** The API version this client talks to. */
    get version(): string;
    /** Payment gateways: create a checkout and redirect the customer to `link`. */
    readonly gateway: {
        create: (params: GatewayCreateParams) => Promise<Gateway>;
        retrieve: (id: number | string) => Promise<Gateway>;
        delete: (id: number | string) => Promise<Gateway>;
    };
    /** Transactions: retrieve, list, charge, refund, capture, pre-authorize. */
    readonly transaction: {
        retrieve: (id: number | string) => Promise<Transaction>;
        list: (params?: TransactionListParams) => Promise<Transaction[]>;
        /** Charge a pre-authorized/tokenized transaction. */
        charge: (id: number | string, params: TransactionChargeParams) => Promise<Transaction>;
        refund: (id: number | string, params?: TransactionRefundParams) => Promise<Transaction>;
        capture: (id: number | string, params?: Record<string, unknown>) => Promise<Transaction>;
        receipt: (id: number | string, params?: Record<string, unknown>) => Promise<Transaction>;
        preAuthorize: (params: Record<string, unknown>) => Promise<Transaction>;
        cancel: (id: number | string) => Promise<Transaction>;
    };
    /** Subscriptions. */
    readonly subscription: {
        retrieve: (id: number | string) => Promise<Subscription>;
        list: (params?: Record<string, unknown>) => Promise<Subscription[]>;
        create: (params: Record<string, unknown>) => Promise<Subscription>;
        update: (id: number | string, params: SubscriptionUpdateParams) => Promise<Subscription>;
        cancel: (id: number | string) => Promise<Subscription>;
    };
    /** Invoices (hosted one-off payment requests). */
    readonly invoice: {
        create: (params: InvoiceCreateParams) => Promise<Invoice>;
        retrieve: (id: number | string) => Promise<Invoice>;
        delete: (id: number | string) => Promise<Invoice>;
    };
    /** Paylinks / payment pages. */
    readonly page: {
        create: (params: Record<string, unknown>) => Promise<Page>;
        retrieve: (id: number | string) => Promise<Page>;
        list: (params?: Record<string, unknown>) => Promise<Page[]>;
        delete: (id: number | string) => Promise<Page>;
    };
    /** Payment page designs. */
    readonly design: {
        create: (params: Record<string, unknown>) => Promise<Design>;
        retrieve: (id: number | string) => Promise<Design>;
        list: (params?: Record<string, unknown>) => Promise<Design[]>;
        update: (id: number | string, params: Record<string, unknown>) => Promise<Design>;
        delete: (id: number | string) => Promise<Design>;
    };
    /** Payouts. */
    readonly payout: {
        retrieve: (id: number | string) => Promise<Payout>;
        list: (params?: Record<string, unknown>) => Promise<Payout[]>;
        details: (id: number | string, params?: Record<string, unknown>) => Promise<Payout>;
    };
    /** Available payment methods. */
    readonly paymentMethod: {
        retrieve: (id: number | string) => Promise<PaymentMethod>;
        list: (params?: Record<string, unknown>) => Promise<PaymentMethod[]>;
    };
    /** Configured payment providers. */
    readonly paymentProvider: {
        list: (params?: Record<string, unknown>) => Promise<PaymentProvider[]>;
    };
    /** QR codes. */
    readonly qrCode: {
        create: (params: Record<string, unknown>) => Promise<QrCode>;
        retrieve: (id: number | string) => Promise<QrCode>;
        delete: (id: number | string) => Promise<QrCode>;
    };
    /** Bills. */
    readonly bill: {
        create: (params: Record<string, unknown>) => Promise<Bill>;
        retrieve: (id: number | string) => Promise<Bill>;
        list: (params?: Record<string, unknown>) => Promise<Bill[]>;
        update: (id: number | string, params: Record<string, unknown>) => Promise<Bill>;
        delete: (id: number | string) => Promise<Bill>;
    };
    /** Signature check: verify instance name and API secret. */
    readonly signatureCheck: {
        retrieve: () => Promise<SignatureCheck>;
    };
    /** One-time auth tokens for dashboard auto-login. */
    readonly authToken: {
        create: (params?: Record<string, unknown>) => Promise<AuthToken>;
    };
    /** ECR (payment terminal) integration. */
    readonly ecr: {
        pair: (id: number | string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>;
        unpair: (id: number | string) => Promise<Record<string, unknown>>;
        payment: (id: number | string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
        cancelPayment: (id: number | string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>;
        voidPayment: (id: number | string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>;
        getPayment: (id: number | string) => Promise<Record<string, unknown>>;
        getPaymentMethods: (id: number | string) => Promise<Record<string, unknown>>;
    };
}
export default PayChef;
