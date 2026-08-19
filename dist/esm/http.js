import { PayChefError } from './errors.js';
export const API_URL_BASE_DOMAIN = 'paychef.com';
export const DEFAULT_API_VERSION = '1.15';
export const CLIENT_VERSION = '1.0.0';
/**
 * Serializes nested params PHP-style (key[sub]=value), RFC 3986 encoded,
 * matching what the PayChef API expects in query strings.
 */
function buildQuery(params, prefix = '') {
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null)
            continue;
        const name = prefix ? `${prefix}[${key}]` : key;
        if (typeof value === 'object' && !(value instanceof Date)) {
            parts.push(buildQuery(value, name));
        }
        else {
            parts.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
        }
    }
    return parts.filter(Boolean).join('&');
}
/**
 * Low-level transport for the PayChef REST API.
 *
 * Request URL format: https://api.{baseDomain}/v{version}/{Model}/{id}/{action}
 * Authentication: x-api-key header carrying the instance API secret.
 */
export class Transport {
    constructor(config) {
        this.config = config;
    }
    get version() {
        return this.config.version;
    }
    async request(model, method, id = 0, action = '', params = {}) {
        const { instance, apiSecret, apiBaseDomain, version, timeout } = this.config;
        const fetchImpl = this.config.fetch ?? fetch;
        const base = `https://api.${apiBaseDomain}/v${version}/${model}/${id}/${action}`;
        const payload = { ...params, model };
        let url;
        const init = {
            method,
            headers: {
                'x-api-key': apiSecret,
                'User-Agent': `paychef-js/${CLIENT_VERSION}`,
            },
            signal: AbortSignal.timeout(timeout),
        };
        if (method === 'GET' || method === 'DELETE') {
            url = `${base}?${buildQuery({ ...payload, instance })}`;
        }
        else {
            url = `${base}?instance=${encodeURIComponent(instance)}`;
            init.body = JSON.stringify(payload);
            init.headers['Content-Type'] = 'application/json';
        }
        let response;
        try {
            response = await fetchImpl(url, init);
        }
        catch (err) {
            throw new PayChefError(`PayChef request failed: ${err.message}`);
        }
        let body;
        try {
            body = (await response.json());
        }
        catch {
            throw new PayChefError('PayChef: invalid response. Check instance name and API secret', response.status);
        }
        if (body.data === undefined || body.status === 'error') {
            throw new PayChefError(body.message ?? 'PayChef: configuration is wrong! Check instance name and API secret', response.status, body.reason);
        }
        return body.data;
    }
}
