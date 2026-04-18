<?php
/**
 * BywLottery PHP SDK - 配置类
 */

namespace BywLottery\SDK\Core;

/**
 * SDK配置类
 */
class Config
{
    /**
     * API基础地址
     */
    const API_BASE_URL = 'http://api.byw.bet:868/api';

    /**
     * 请求超时时间（秒）
     */
    const REQUEST_TIMEOUT = 30;

    /**
     * 支持的数据格式
     */
    const SUPPORTED_FORMATS = ['json', 'xml', 'json2', 'jsonp'];

    /**
     * 默认请求格式
     */
    const DEFAULT_FORMAT = 'json';

    /**
     * 最大返回条数
     */
    const MAX_LIMIT = 20;

    /**
     * 最小返回条数
     */
    const MIN_LIMIT = 1;

    /**
     * 支持的彩种映射
     */
    const LOTTERY_TYPES = [
        // 时时彩
        'cqssc' => ['name' => '重庆时时彩', 'category' => 'ssc'],
        'tjsssc' => ['name' => '天津时时彩', 'category' => 'ssc'],
        'xjssc' => ['name' => '新疆时时彩', 'category' => 'ssc'],
        
        // 11选5
        'gd11x5' => ['name' => '广东11选5', 'category' => '11x5'],
        'sd11x5' => ['name' => '山东11选5', 'category' => '11x5'],
        'jx11x5' => ['name' => '江西11选5', 'category' => '11x5'],
        
        // 快三
        'ahk3' => ['name' => '安徽快三', 'category' => 'k3'],
        'jsk3' => ['name' => '江苏快三', 'category' => 'k3'],
        'hbk3' => ['name' => '湖北快三', 'category' => 'k3'],
        
        // 排列
        'pl3' => ['name' => '排列三', 'category' => 'pl'],
        'pl5' => ['name' => '排列五', 'category' => 'pl'],
        
        // 3D
        'fc3d' => ['name' => '福彩3D', 'category' => '3d'],
        
        // 双色球
        'ssq' => ['name' => '双色球', 'category' => 'dc'],
        'qlc' => ['name' => '七乐彩', 'category' => 'dc']
    ];

    /**
     * 验证Token格式
     */
    public static function validateToken($token)
    {
        if (empty($token)) {
            throw new \InvalidArgumentException('Token不能为空');
        }
        
        if (strlen($token) < 8) {
            throw new \InvalidArgumentException('Token格式不正确');
        }
        
        return true;
    }

    /**
     * 验证彩种代码
     */
    public static function validateLotteryType($type)
    {
        if (!isset(self::LOTTERY_TYPES[$type])) {
            throw new \InvalidArgumentException('不支持的彩种: ' . $type);
        }
        return true;
    }

    /**
     * 验证limit参数
     */
    public static function validateLimit($limit)
    {
        $limit = (int) $limit;
        if ($limit < self::MIN_LIMIT || $limit > self::MAX_LIMIT) {
            throw new \InvalidArgumentException(
                sprintf('limit必须在%d-%d之间', self::MIN_LIMIT, self::MAX_LIMIT)
            );
        }
        return true;
    }
}
