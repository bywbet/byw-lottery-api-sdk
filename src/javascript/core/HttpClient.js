/**
 * BywLottery SDK - HTTP请求工具
 */

const http = require('http');
const https = require('https');
const querystring = require('querystring');

/**
 * HTTP请求封装
 */
class HttpClient {
    constructor(options = {}) {
        this.timeout = options.timeout || 30000;
        this.retries = options.retries || 3;
        this.retryDelay = options.retryDelay || 1000;
    }

    /**
     * GET请求
     */
    get(url, params = {}, headers = {}) {
        const queryString = querystring.stringify(params);
        const fullUrl = `${url}?${queryString}`;
        return this._request('GET', fullUrl, null, headers);
    }

    /**
     * POST请求
     */
    post(url, data = {}, headers = {}) {
        return this._request('POST', url, data, headers);
    }

    /**
     * 核心请求方法
     */
    _request(method, url, data, headers) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: method,
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'BywLottery-SDK/1.0',
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            const req = protocol.request(options, (res) => {
                let body = '';
                res.setEncoding('utf8');

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            body: body
                        });
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('请求超时'));
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }
}

module.exports = HttpClient;
