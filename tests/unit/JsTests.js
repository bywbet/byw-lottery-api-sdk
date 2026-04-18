/**
 * JavaScript SDK 单元测试
 */

const BywClient = require('../../src/javascript/index.js');

describe('BywClient', () => {
    const TEST_TOKEN = 'test_token';
    let client;

    beforeEach(() => {
        client = new BywClient(TEST_TOKEN);
    });

    describe('Constructor', () => {
        test('should create client with valid token', () => {
            expect(new BywClient(TEST_TOKEN)).toBeInstanceOf(BywClient);
        });

        test('should throw error with empty token', () => {
            expect(() => new BywClient('')).toThrow('API Token不能为空');
        });

        test('should throw error with null token', () => {
            expect(() => new BywClient(null)).toThrow('API Token不能为空');
        });

        test('should accept custom baseUrl', () => {
            const customUrl = 'https://custom.api.com';
            const customClient = new BywClient(TEST_TOKEN, { baseUrl: customUrl });
            expect(customClient.baseUrl).toBe(customUrl);
        });

        test('should accept custom timeout', () => {
            const customClient = new BywClient(TEST_TOKEN, { timeout: 60000 });
            expect(customClient.timeout).toBe(60000);
        });
    });

    describe('SUPPORTED_LOTTERIES', () => {
        test('should be an object', () => {
            expect(typeof BywClient.SUPPORTED_LOTTERIES).toBe('object');
        });

        test('should contain cqssc', () => {
            expect(BywClient.SUPPORTED_LOTTERIES).toHaveProperty('cqssc');
            expect(BywClient.SUPPORTED_LOTTERIES.cqssc).toBe('重庆时时彩');
        });

        test('should contain gd11x5', () => {
            expect(BywClient.SUPPORTED_LOTTERIES).toHaveProperty('gd11x5');
            expect(BywClient.SUPPORTED_LOTTERIES.gd11x5).toBe('广东11选5');
        });

        test('should contain multiple lottery types', () => {
            const keys = Object.keys(BywClient.SUPPORTED_LOTTERIES);
            expect(keys.length).toBeGreaterThan(5);
        });
    });

    describe('isSupported', () => {
        test('should return true for valid lottery type', () => {
            expect(BywClient.isSupported('cqssc')).toBe(true);
            expect(BywClient.isSupported('gd11x5')).toBe(true);
            expect(BywClient.isSupported('ahk3')).toBe(true);
        });

        test('should return false for invalid lottery type', () => {
            expect(BywClient.isSupported('invalid')).toBe(false);
            expect(BywClient.isSupported('')).toBe(false);
        });
    });

    describe('BASE_URL', () => {
        test('should be defined', () => {
            expect(BywClient.BASE_URL).toBeDefined();
        });

        test('should be api.byw.bet:868', () => {
            expect(BywClient.BASE_URL).toBe('api.byw.bet:868');
        });
    });

    describe('DEFAULT_PATH', () => {
        test('should be defined', () => {
            expect(BywClient.DEFAULT_PATH).toBeDefined();
        });

        test('should be /api', () => {
            expect(BywClient.DEFAULT_PATH).toBe('/api');
        });
    });
});

describe('HttpClient', () => {
    const HttpClient = require('../../src/javascript/core/HttpClient');

    describe('Constructor', () => {
        test('should create client with default options', () => {
            const httpClient = new HttpClient();
            expect(httpClient.timeout).toBe(30000);
            expect(httpClient.retries).toBe(3);
        });

        test('should accept custom options', () => {
            const httpClient = new HttpClient({
                timeout: 60000,
                retries: 5,
                retryDelay: 2000
            });
            expect(httpClient.timeout).toBe(60000);
            expect(httpClient.retries).toBe(5);
            expect(httpClient.retryDelay).toBe(2000);
        });
    });
});
