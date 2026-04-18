<?php
/**
 * BywLottery PHP SDK - 核心异常类
 */

namespace BywLottery\SDK\Core;

/**
 * SDK异常基类
 */
class BywException extends \Exception
{
    public function __construct($message, $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}

/**
 * API请求异常
 */
class ApiException extends BywException
{
    private $httpCode;
    private $response;

    public function __construct($message, $httpCode = 0, $response = null, \Throwable $previous = null)
    {
        parent::__construct($message, $httpCode, $previous);
        $this->httpCode = $httpCode;
        $this->response = $response;
    }

    public function getHttpCode()
    {
        return $this->httpCode;
    }

    public function getResponse()
    {
        return $this->response;
    }
}

/**
 * 参数验证异常
 */
class ValidationException extends BywException
{
    private $field;
    private $value;

    public function __construct($message, $field = '', $value = null, \Throwable $previous = null)
    {
        parent::__construct($message, 400, $previous);
        $this->field = $field;
        $this->value = $value;
    }

    public function getField()
    {
        return $this->field;
    }

    public function getInvalidValue()
    {
        return $this->value;
    }
}
