/**
 * Shared types for the PayChef API.
 *
 * All interfaces carry an index signature so that additional fields
 * returned by newer API versions never break your integration.
 */
export type Currency = string;
export type TransactionStatus = 'waiting' | 'confirmed' | 'cancelled' | 'declined' | 'authorized' | 'reserved' | 'refunded' | 'partially-refunded' | 'refund_pending' | 'chargeback' | 'error' | 'expired' | 'uncaptured' | (string & {});
export interface Contact {
    title?: 'mister' | 'miss' | (string & {});
    firstname?: string;
    lastname?: string;
    company?: string;
    street?: string;
    zip?: string;
    place?: string;
    country?: string;
    phone?: string;
    email?: string;
    date_of_birth?: string;
    [key: string]: unknown;
}
export interface Purpose {
    [languageId: string]: string;
}
export interface GatewayCreateParams {
    /** Amount in the smallest currency unit (e.g. rappen/cents). */
    amount: number;
    currency: Currency;
    vatRate?: number;
    sku?: string;
    purpose?: string;
    successRedirectUrl?: string;
    failedRedirectUrl?: string;
    cancelRedirectUrl?: string;
    /** Restrict the payment method selection, e.g. ['visa', 'mastercard', 'twint']. */
    pm?: string[];
    preAuthorization?: boolean;
    chargeOnAuthorization?: boolean;
    reservation?: boolean;
    referenceId?: string;
    fields?: Record<string, {
        value?: string;
        mandatory?: boolean;
    }>;
    concardisOrderId?: string;
    buttonText?: string;
    lookAndFeelProfile?: string;
    successMessage?: string;
    subscriptionState?: boolean;
    subscriptionInterval?: string;
    subscriptionPeriod?: string;
    subscriptionCancellationInterval?: string;
    validity?: number;
    qrCodeSessionId?: string;
    [key: string]: unknown;
}
export interface Gateway {
    id: number;
    status: 'waiting' | 'confirmed' | 'authorized' | 'reserved' | (string & {});
    hash: string;
    referenceId?: string;
    /** Payment page URL to redirect your customer to. */
    link: string;
    invoices?: unknown[];
    preAuthorization?: boolean;
    reservation?: boolean;
    fields?: Record<string, unknown>;
    psp?: unknown;
    pm?: string[];
    amount: number;
    currency: Currency;
    vatRate?: number;
    sku?: string;
    createdAt?: number;
    [key: string]: unknown;
}
export interface Transaction {
    id: number;
    uuid?: string;
    status: TransactionStatus;
    time?: string;
    lang?: string;
    psp?: string;
    pspId?: number;
    payment?: {
        brand?: string;
        [key: string]: unknown;
    };
    amount: number;
    currency?: Currency;
    referenceId?: string;
    invoice?: Record<string, unknown>;
    contact?: Contact;
    refundable?: boolean;
    partiallyRefundable?: boolean;
    [key: string]: unknown;
}
export interface TransactionChargeParams {
    amount: number;
    purpose?: string;
    referenceId?: string;
    [key: string]: unknown;
}
export interface TransactionRefundParams {
    /** Amount to refund in the smallest currency unit; omit for a full refund. */
    amount?: number;
    [key: string]: unknown;
}
export interface TransactionListParams {
    filterDatetimeUtcGreaterThan?: string;
    filterDatetimeUtcLessThan?: string;
    filterMyTransactionsOnly?: boolean;
    offset?: number;
    limit?: number;
    [key: string]: unknown;
}
export interface Subscription {
    id: number;
    status?: 'active' | 'cancelled' | (string & {});
    amount?: number;
    currency?: Currency;
    interval?: string;
    payment_interval?: string;
    period?: string;
    cancellation_interval?: string;
    valid_until?: string;
    contact?: Contact;
    [key: string]: unknown;
}
export interface SubscriptionUpdateParams {
    amount?: number;
    currency?: Currency;
    purpose?: string;
    interval?: string;
    [key: string]: unknown;
}
export interface InvoiceCreateParams {
    title: string;
    description?: string;
    psp?: number;
    referenceId?: string;
    purpose?: string;
    amount: number;
    vatRate?: number;
    currency: Currency;
    name?: string;
    fields?: Record<string, {
        value?: string;
        mandatory?: boolean;
    }>;
    [key: string]: unknown;
}
export interface Invoice {
    id: number;
    hash?: string;
    referenceId?: string;
    link?: string;
    status?: string;
    amount?: number;
    currency?: Currency;
    purpose?: string | Purpose;
    [key: string]: unknown;
}
export interface Page {
    id: number;
    hash?: string;
    link?: string;
    status?: string;
    amount?: number;
    currency?: Currency;
    [key: string]: unknown;
}
export interface Design {
    id: number;
    uuid?: string;
    default?: boolean;
    name?: string;
    fontFamily?: string;
    fontSize?: number;
    textColor?: string;
    backgroundColor?: string;
    headerBackgroundColor?: string;
    emailHeaderBackgroundColor?: string;
    [key: string]: unknown;
}
export interface Payout {
    id: number;
    uuid?: string;
    amount?: number;
    currency?: Currency;
    dateFrom?: string;
    dateTo?: string;
    executedAt?: string;
    [key: string]: unknown;
}
export interface PaymentMethod {
    id: number | string;
    name?: string | Record<string, string>;
    [key: string]: unknown;
}
export interface PaymentProvider {
    id: number | string;
    name?: string;
    paymentMethods?: PaymentMethod[];
    activePaymentMethods?: PaymentMethod[];
    [key: string]: unknown;
}
export interface QrCode {
    id: number | string;
    uuid?: string;
    sessionId?: string;
    [key: string]: unknown;
}
export interface SignatureCheck {
    [key: string]: unknown;
}
export interface AuthToken {
    [key: string]: unknown;
}
export interface Bill {
    id: number | string;
    [key: string]: unknown;
}
