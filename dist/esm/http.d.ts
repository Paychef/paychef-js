export declare const API_URL_BASE_DOMAIN = "paychef.com";
export declare const DEFAULT_API_VERSION = "1.15";
export declare const CLIENT_VERSION = "1.0.0";
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface TransportConfig {
    instance: string;
    apiSecret: string;
    apiBaseDomain: string;
    version: string;
    /** Request timeout in milliseconds. */
    timeout: number;
    /** Optional fetch implementation override (e.g. for testing). */
    fetch?: typeof fetch;
}
/**
 * Low-level transport for the PayChef REST API.
 *
 * Request URL format: https://api.{baseDomain}/v{version}/{Model}/{id}/{action}
 * Authentication: x-api-key header carrying the instance API secret.
 */
export declare class Transport {
    private readonly config;
    constructor(config: TransportConfig);
    get version(): string;
    request<T>(model: string, method: HttpMethod, id?: number | string, action?: string, params?: Record<string, unknown>): Promise<T>;
}
