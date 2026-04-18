<?php
/**
 * PHP SDK 单元测试
 */

use PHPUnit\Framework\TestCase;
use BywLottery\SDK\BywClient;

class BywClientTests extends TestCase
{
    private const TEST_TOKEN = 'test_token';
    private $client;

    protected function setUp(): void
    {
        $this->client = new BywClient(self::TEST_TOKEN);
    }

    public function testConstructorWithValidToken()
    {
        $client = new BywClient(self::TEST_TOKEN);
        $this->assertInstanceOf(BywClient::class, $client);
    }

    public function testConstructorWithEmptyToken()
    {
        $this->expectException(InvalidArgumentException::class);
        new BywClient('');
    }

    public function testGetSupportedLotteries()
    {
        $lotteries = BywClient::getSupportedLotteries();
        
        $this->assertIsArray($lotteries);
        $this->assertNotEmpty($lotteries);
        // lotteryid: 4 = 重庆时时彩
        $this->assertArrayHasKey('4', $lotteries);
        // lotteryid: 59 = 广东11选5
        $this->assertArrayHasKey('59', $lotteries);
    }

    public function testIsLotterySupported()
    {
        // lotteryid: 4 = 重庆时时彩
        $this->assertTrue(BywClient::isLotterySupported('4'));
        // lotteryid: 59 = 广东11选5
        $this->assertTrue(BywClient::isLotterySupported('59'));
        $this->assertFalse(BywClient::isLotterySupported('invalid'));
    }

    public function testGetLotteryName()
    {
        $this->assertEquals('重庆时时彩(欢乐生肖)', BywClient::getLotteryName('4'));
        $this->assertEquals('广东11选5', BywClient::getLotteryName('59'));
        $this->assertNull(BywClient::getLotteryName('invalid'));
    }

    public function testSupportedFormats()
    {
        $reflection = new ReflectionClass($this->client);
        $property = $reflection->getProperty('supportedFormats');
        $property->setAccessible(true);
        $formats = $property->getValue($this->client);

        $this->assertContains('json', $formats);
        $this->assertContains('xml', $formats);
        $this->assertContains('json2', $formats);
        $this->assertContains('jsonp', $formats);
    }
}

class ConfigTests extends TestCase
{
    public function testApiBaseUrl()
    {
        $this->assertEquals('http://api.byw.bet:868/api', BywLottery\SDK\Core\Config::API_BASE_URL);
    }

    public function testRequestTimeout()
    {
        $this->assertEquals(30, BywLottery\SDK\Core\Config::REQUEST_TIMEOUT);
    }

    public function testMaxLimit()
    {
        $this->assertEquals(20, BywLottery\SDK\Core\Config::MAX_LIMIT);
    }

    public function testMinLimit()
    {
        $this->assertEquals(1, BywLottery\SDK\Core\Config::MIN_LIMIT);
    }

    public function testValidateTokenWithValidToken()
    {
        $this->assertTrue(BywLottery\SDK\Core\Config::validateToken('valid_token_123'));
    }

    public function testValidateTokenWithEmptyToken()
    {
        $this->expectException(InvalidArgumentException::class);
        BywLottery\SDK\Core\Config::validateToken('');
    }

    public function testValidateTokenWithShortToken()
    {
        $this->expectException(InvalidArgumentException::class);
        BywLottery\SDK\Core\Config::validateToken('short');
    }

    public function testValidateLotteryTypeWithValidType()
    {
        // lotteryid: 4 = 重庆时时彩
        $this->assertTrue(BywLottery\SDK\Core\Config::validateLotteryType('4'));
    }

    public function testValidateLotteryTypeWithInvalidType()
    {
        $this->expectException(InvalidArgumentException::class);
        BywLottery\SDK\Core\Config::validateLotteryType('invalid_type');
    }

    public function testValidateLimitWithValidValue()
    {
        $this->assertTrue(BywLottery\SDK\Core\Config::validateLimit(10));
    }

    public function testValidateLimitWithZero()
    {
        $this->expectException(InvalidArgumentException::class);
        BywLottery\SDK\Core\Config::validateLimit(0);
    }

    public function testValidateLimitWithTooHigh()
    {
        $this->expectException(InvalidArgumentException::class);
        BywLottery\SDK\Core\Config::validateLimit(100);
    }
}

class ExceptionsTests extends TestCase
{
    public function testBywException()
    {
        $exception = new BywLottery\SDK\Core\BywException('Test message', 500);
        $this->assertEquals('Test message', $exception->getMessage());
        $this->assertEquals(500, $exception->getCode());
    }

    public function testApiException()
    {
        $exception = new BywLottery\SDK\Core\ApiException('API Error', 500, ['error' => 'test']);
        $this->assertEquals('API Error', $exception->getMessage());
        $this->assertEquals(500, $exception->getHttpCode());
        $this->assertEquals(['error' => 'test'], $exception->getResponse());
    }

    public function testValidationException()
    {
        $exception = new BywLottery\SDK\Core\ValidationException('Invalid field', 'field_name', 'invalid_value');
        $this->assertEquals('Invalid field', $exception->getMessage());
        $this->assertEquals('field_name', $exception->getField());
        $this->assertEquals('invalid_value', $exception->getInvalidValue());
    }
}
