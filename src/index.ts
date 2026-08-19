import {
  API_URL_BASE_DOMAIN,
  DEFAULT_API_VERSION,
  Transport,
} from './http.js';
import { PayChefError } from './errors.js';
import type {
  AuthToken,
  Bill,
  Design,
  Gateway,
  GatewayCreateParams,
  Invoice,
  InvoiceCreateParams,
  Page,
  PaymentMethod,
  PaymentProvider,
  Payout,
  QrCode,
  SignatureCheck,
  Subscription,
  SubscriptionUpdateParams,
  Transaction,
  TransactionChargeParams,
  TransactionListParams,
  TransactionRefundParams,
} from './types.js';

export * from './types.js';
export { PayChefError } from './errors.js';
export { API_URL_BASE_DOMAIN, DEFAULT_API_VERSION, CLIENT_VERSION } from './http.js';

/** Unwraps single-object responses that the API may wrap in an array. */
function single<T>(data: unknown): T {
  return (Array.isArray(data) ? data[0] : data) as T;
}

function list<T>(data: unknown): T[] {
  return (Array.isArray(data) ? data : [data]) as T[];
}

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
export class PayChef {
  private readonly transport: Transport;

  constructor(options: PayChefOptions) {
    if (!options?.instance || !options?.apiSecret) {
      throw new PayChefError('PayChef: instance and apiSecret are required');
    }
    this.transport = new Transport({
      instance: options.instance,
      apiSecret: options.apiSecret,
      apiBaseDomain: options.apiBaseDomain ?? API_URL_BASE_DOMAIN,
      version: options.version ?? DEFAULT_API_VERSION,
      timeout: options.timeout ?? 20_000,
      fetch: options.fetch,
    });
  }

  /** The API version this client talks to. */
  get version(): string {
    return this.transport.version;
  }

  /** Payment gateways: create a checkout and redirect the customer to `link`. */
  readonly gateway = {
    create: async (params: GatewayCreateParams): Promise<Gateway> =>
      single<Gateway>(await this.transport.request('Gateway', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<Gateway> =>
      single<Gateway>(await this.transport.request('Gateway', 'GET', id)),
    delete: async (id: number | string): Promise<Gateway> =>
      single<Gateway>(await this.transport.request('Gateway', 'DELETE', id)),
  };

  /** Transactions: retrieve, list, charge, refund, capture, pre-authorize. */
  readonly transaction = {
    retrieve: async (id: number | string): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'GET', id)),
    list: async (params: TransactionListParams = {}): Promise<Transaction[]> =>
      list<Transaction>(await this.transport.request('Transaction', 'GET', 0, '', params)),
    /** Charge a pre-authorized/tokenized transaction. */
    charge: async (id: number | string, params: TransactionChargeParams): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'POST', id, '', params)),
    refund: async (id: number | string, params: TransactionRefundParams = {}): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'POST', id, 'refund', params)),
    capture: async (id: number | string, params: Record<string, unknown> = {}): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'POST', id, 'capture', params)),
    receipt: async (id: number | string, params: Record<string, unknown> = {}): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'POST', id, 'receipt', params)),
    preAuthorize: async (params: Record<string, unknown>): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'POST', 0, 'preAuthorize', params)),
    cancel: async (id: number | string): Promise<Transaction> =>
      single<Transaction>(await this.transport.request('Transaction', 'DELETE', id)),
  };

  /** Subscriptions. */
  readonly subscription = {
    retrieve: async (id: number | string): Promise<Subscription> =>
      single<Subscription>(await this.transport.request('Subscription', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<Subscription[]> =>
      list<Subscription>(await this.transport.request('Subscription', 'GET', 0, '', params)),
    create: async (params: Record<string, unknown>): Promise<Subscription> =>
      single<Subscription>(await this.transport.request('Subscription', 'POST', 0, '', params)),
    update: async (id: number | string, params: SubscriptionUpdateParams): Promise<Subscription> =>
      single<Subscription>(await this.transport.request('Subscription', 'PUT', id, '', params)),
    cancel: async (id: number | string): Promise<Subscription> =>
      single<Subscription>(await this.transport.request('Subscription', 'DELETE', id)),
  };

  /** Invoices (hosted one-off payment requests). */
  readonly invoice = {
    create: async (params: InvoiceCreateParams): Promise<Invoice> =>
      single<Invoice>(await this.transport.request('Invoice', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<Invoice> =>
      single<Invoice>(await this.transport.request('Invoice', 'GET', id)),
    delete: async (id: number | string): Promise<Invoice> =>
      single<Invoice>(await this.transport.request('Invoice', 'DELETE', id)),
  };

  /** Paylinks / payment pages. */
  readonly page = {
    create: async (params: Record<string, unknown>): Promise<Page> =>
      single<Page>(await this.transport.request('Page', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<Page> =>
      single<Page>(await this.transport.request('Page', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<Page[]> =>
      list<Page>(await this.transport.request('Page', 'GET', 0, '', params)),
    delete: async (id: number | string): Promise<Page> =>
      single<Page>(await this.transport.request('Page', 'DELETE', id)),
  };

  /** Payment page designs. */
  readonly design = {
    create: async (params: Record<string, unknown>): Promise<Design> =>
      single<Design>(await this.transport.request('Design', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<Design> =>
      single<Design>(await this.transport.request('Design', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<Design[]> =>
      list<Design>(await this.transport.request('Design', 'GET', 0, '', params)),
    // The API expects POST (not PUT) for design updates.
    update: async (id: number | string, params: Record<string, unknown>): Promise<Design> =>
      single<Design>(await this.transport.request('Design', 'POST', id, '', params)),
    delete: async (id: number | string): Promise<Design> =>
      single<Design>(await this.transport.request('Design', 'DELETE', id)),
  };

  /** Payouts. */
  readonly payout = {
    retrieve: async (id: number | string): Promise<Payout> =>
      single<Payout>(await this.transport.request('Payout', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<Payout[]> =>
      list<Payout>(await this.transport.request('Payout', 'GET', 0, '', params)),
    details: async (id: number | string, params: Record<string, unknown> = {}): Promise<Payout> =>
      single<Payout>(await this.transport.request('Payout', 'GET', id, 'details', params)),
  };

  /** Available payment methods. */
  readonly paymentMethod = {
    retrieve: async (id: number | string): Promise<PaymentMethod> =>
      single<PaymentMethod>(await this.transport.request('PaymentMethod', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<PaymentMethod[]> =>
      list<PaymentMethod>(await this.transport.request('PaymentMethod', 'GET', 0, '', params)),
  };

  /** Configured payment providers. */
  readonly paymentProvider = {
    list: async (params: Record<string, unknown> = {}): Promise<PaymentProvider[]> =>
      list<PaymentProvider>(await this.transport.request('PaymentProvider', 'GET', 0, '', params)),
  };

  /** QR codes. */
  readonly qrCode = {
    create: async (params: Record<string, unknown>): Promise<QrCode> =>
      single<QrCode>(await this.transport.request('QrCode', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<QrCode> =>
      single<QrCode>(await this.transport.request('QrCode', 'GET', id)),
    delete: async (id: number | string): Promise<QrCode> =>
      single<QrCode>(await this.transport.request('QrCode', 'DELETE', id)),
  };

  /** Bills. */
  readonly bill = {
    create: async (params: Record<string, unknown>): Promise<Bill> =>
      single<Bill>(await this.transport.request('Bill', 'POST', 0, '', params)),
    retrieve: async (id: number | string): Promise<Bill> =>
      single<Bill>(await this.transport.request('Bill', 'GET', id)),
    list: async (params: Record<string, unknown> = {}): Promise<Bill[]> =>
      list<Bill>(await this.transport.request('Bill', 'GET', 0, '', params)),
    update: async (id: number | string, params: Record<string, unknown>): Promise<Bill> =>
      single<Bill>(await this.transport.request('Bill', 'PUT', id, '', params)),
    delete: async (id: number | string): Promise<Bill> =>
      single<Bill>(await this.transport.request('Bill', 'DELETE', id)),
  };

  /** Signature check: verify instance name and API secret. */
  readonly signatureCheck = {
    retrieve: async (): Promise<SignatureCheck> =>
      single<SignatureCheck>(await this.transport.request('SignatureCheck', 'GET', 0)),
  };

  /** One-time auth tokens for dashboard auto-login. */
  readonly authToken = {
    create: async (params: Record<string, unknown> = {}): Promise<AuthToken> =>
      single<AuthToken>(await this.transport.request('AuthToken', 'POST', 0, '', params)),
  };

  /** ECR (payment terminal) integration. */
  readonly ecr = {
    pair: async (id: number | string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPairing', 'POST', id, 'pair', params)),
    unpair: async (id: number | string): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPairing', 'DELETE', id, 'pair')),
    payment: async (id: number | string, params: Record<string, unknown>): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPayment', 'POST', id, 'payment', params)),
    cancelPayment: async (id: number | string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPayment', 'POST', id, 'cancel', params)),
    voidPayment: async (id: number | string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPayment', 'POST', id, 'void', params)),
    getPayment: async (id: number | string): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPayment', 'GET', id)),
    getPaymentMethods: async (id: number | string): Promise<Record<string, unknown>> =>
      single(await this.transport.request('EcrPayment', 'GET', id, 'paymentMethods')),
  };
}

export default PayChef;
