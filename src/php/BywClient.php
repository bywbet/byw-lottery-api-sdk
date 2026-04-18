<?php
/**
 * BywLottery SDK - 博易网彩票开奖数据SDK
 * 
 * 官方文档: https://www.byw.bet
 * GitHub: https://github.com/your-repo/byw-lottery-api-sdk
 * 
 * 核心关键词: 彩票API接口 | 实时开奖数据API | PHP彩票SDK | 开奖数据接口
 */

namespace BywLottery\SDK;

use Exception;

/**
 * 博易网彩票开奖数据API客户端
 * 
 * 彩票API接口 - PHP开发首选SDK
 * 支持: 实时开奖数据 | 历史开奖查询 | 多彩种支持 | JSON/XML格式
 */
class BywClient
{
    /**
     * API基础地址
     */
    const DEFAULT_BASE_URL = 'http://api.byw.bet:868/api';

    /**
     * API Token
     */
    private $apiToken;

    /**
     * API基础URL
     */
    private $baseUrl;

    /**
     * 支持的返回格式
     */
    private $supportedFormats = ['json', 'xml', 'json2', 'jsonp'];

    /**
     * 支持的彩种列表（共109个 cstatus=1 的彩种，使用数据库 lotteryid）
     */
    private static $supportedLotteries = [
        // ==================== 时时彩系列 ====================
        '1' => '黑龙江时时彩',
        '2' => '内蒙古时时彩',
        '3' => '天津时时彩',
        '4' => '重庆时时彩(欢乐生肖)',
        '5' => '新疆时时彩',
        '6' => '云南时时彩',
        '7' => '上海时时乐',

        // ==================== PK10/赛车系列 ====================
        '8' => '北京赛车(PK10)',
        '9' => '北京快中彩',
        '112' => '幸运飞艇',

        // ==================== 快乐12系列 ====================
        '11' => '辽宁快乐12',
        '12' => '浙江快乐12',
        '13' => '四川快乐12',
        '14' => '河南泳坛夺金(481)',
        '15' => '山西泳坛夺金(481)',
        '16' => '新疆喜乐彩',
        '17' => '四川金七乐',
        '19' => '湖南幸运赛车',
        '20' => '山东群英会',

        // ==================== 11选5系列 ====================
        '52' => '江苏11选5',
        '53' => '湖北11选5',
        '54' => '浙江11选5',
        '55' => '江西11选5',
        '56' => '新疆11选5',
        '57' => '安徽11选5',
        '58' => '广西11选5',
        '59' => '广东11选5',
        '60' => '山东11选5',

        // ==================== 快三系列 ====================
        '78' => '江苏快三',
        '79' => '广西快三',
        '80' => '北京快三',
        '81' => '福建快三',
        '82' => '河北快三',
        '83' => '上海快三',
        '84' => '湖北快三',
        '85' => '安徽快三',
        '86' => '吉林快三',

        // ==================== 快乐十分系列 ====================
        '93' => '广东快乐十分',
        '94' => '广西快乐十分',
        '95' => '天津快乐十分',
        '96' => '湖南快乐十分',
        '97' => '重庆幸运农场',
        '98' => '陕西快乐十分',
        '99' => '山西快乐十分',
        '100' => '云南快乐十分',
        '101' => '黑龙江快乐十分',

        // ==================== 168极速系列 ====================
        '102' => '168极速赛车(PK10)',
        '103' => '168极速时时彩',
        '104' => '168极速飞艇',
        '105' => '168极速快乐十分',
        '106' => '168极速⑥合彩',
        '107' => '168极速11选5',
        '108' => '168极速快三',
        '109' => '168极速快乐8',
        '110' => '168极速28(PC蛋蛋)',

        // ==================== 澳洲彩票 ====================
        '113' => '澳洲幸运5(时时彩)',
        '114' => '澳洲幸运8(快乐十分)',
        '115' => '澳洲幸运10(PK10)',
        '116' => '澳洲幸运20(快乐8)',

        // ==================== 台湾彩票 ====================
        '117' => '台湾賓果(BINGO)',
        '135' => '台湾五分彩',

        // ==================== 越南/印尼彩票 ====================
        '118' => '越南河内5分彩',
        '119' => '越南河内1分彩',
        '120' => '印尼5分彩',
        '121' => '印尼1分彩',

        // ==================== 加拿大彩票 ====================
        '122' => '加拿大卑诗快乐8',
        '123' => '加拿大西部快乐8',
        '140' => '加拿大卑诗3.5分彩',

        // ==================== 快乐8/Keno系列 ====================
        '10' => '北京快乐8',
        '127' => '斯洛伐克快乐8',
        '162' => '俄勒冈快乐8',
        '164' => '肯塔基快乐8',

        // ==================== 28/PC蛋蛋系列 ====================
        '129' => 'PC蛋蛋(北京28)',
        '130' => '加拿大28',
        '131' => '斯洛伐克28',
        '134' => '澳洲28',
        '136' => '台湾⑥合彩28',
        '137' => '俄勒冈28',
        '138' => '肯塔基28',

        // ==================== 腾讯/QQ彩票 ====================
        '132' => '腾讯分分彩(奇趣)',
        '133' => 'QQ分分彩(奇趣)',

        // ==================== 波场彩票 ====================
        '163' => '波场哈希分分彩',

        // ==================== 传统彩票 - 福彩 ====================
        '21' => '（福彩）福彩3D',
        '22' => '（体彩）双色球',
        '23' => '（体彩）七乐彩',
        '31' => '福彩15选5',
        '32' => '福彩东方6+1',
        '39' => '黑龙江福彩22选5',
        '40' => '黑龙江福彩36选7',
        '41' => '黑龙江福彩P62',
        '43' => '上海天天彩选4',
        '38' => '广西福彩快乐双彩',
        '47' => '河北燕赵20选5',
        '48' => '河北燕赵好运2',
        '49' => '河北燕赵好运3',
        '50' => '河北燕赵排列5',
        '51' => '河北燕赵排列7',

        // ==================== 传统彩票 - 体彩 ====================
        '24' => '（体彩）大乐透',
        '25' => '（体彩）排列三',
        '26' => '（体彩）排列五',
        '27' => '（体彩）七星彩',
        '28' => '足彩胜负(任九)',
        '29' => '四场进球彩',
        '30' => '六场半全场',
        '35' => '福建体彩22选5',
        '36' => '福建体彩31选7',
        '37' => '福建体彩36选7',
        '42' => '江苏体彩7位数',
        '159' => '海南4+1',

        // ==================== 香港/国际彩票 ====================
        '111' => '香港⑥合彩',
        '160' => '美国强力球',
        '161' => '美国超级百万'
    ];

    /**
     * 构造函数
     * 
     * @param string $token API接口密钥
     * @param string $baseUrl API基础地址（可选）
     */
    public function __construct($token, $baseUrl = self::DEFAULT_BASE_URL)
    {
        if (empty($token)) {
            throw new \InvalidArgumentException('API Token不能为空');
        }
        
        $this->apiToken = $token;
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    /**
     * 获取最新一期开奖数据
     * 
     * @param string $lotteryType 彩种代码
     * @param bool $includeNextTime 是否包含下一期开奖时间
     * @return array|null
     * 
     * 使用示例:
     * ```php
     * $client = new BywClient('YOUR_TOKEN');
     * $result = $client->getLatest('cqssc');
     * print_r($result);
     * ```
     */
    public function getLatest($lotteryType, $includeNextTime = false)
    {
        $response = $this->request([
            't' => $lotteryType,
            'limit' => 1,
            'nexttime' => $includeNextTime ? 1 : 0
        ]);

        return !empty($response['Data']) ? $response['Data'][0] : null;
    }

    /**
     * 获取最新多期开奖数据
     * 
     * @param string $lotteryType 彩种代码
     * @param int $limit 返回条数（1-20）
     * @param bool $includeNextTime 是否包含下一期开奖时间
     * @return array
     */
    public function getLatestMulti($lotteryType, $limit = 5, $includeNextTime = false)
    {
        $limit = max(1, min(20, $limit));
        
        $response = $this->request([
            't' => $lotteryType,
            'limit' => $limit,
            'nexttime' => $includeNextTime ? 1 : 0
        ]);

        return $response['Data'] ?? [];
    }

    /**
     * 获取指定日期的历史开奖数据
     * 
     * @param string $lotteryType 彩种代码
     * @param string $date 日期（格式：YYYYMMDD或Y-m-d）
     * @return array
     */
    public function getByDate($lotteryType, $date)
    {
        $dateStr = date('Ymd', strtotime($date));
        
        $response = $this->request([
            't' => $lotteryType,
            'date' => $dateStr
        ]);

        return $response['Data'] ?? [];
    }

    /**
     * 获取历史开奖数据
     * 
     * @param string $lotteryType 彩种代码
     * @param int $limit 返回条数
     * @return array
     */
    public function getHistory($lotteryType, $limit = 10)
    {
        $limit = max(1, min(20, $limit));
        
        $response = $this->request([
            't' => $lotteryType,
            'limit' => $limit
        ]);

        return $response['Data'] ?? [];
    }

    /**
     * 执行API请求
     * 
     * @param array $params 请求参数
     * @param string $format 返回格式
     * @return array
     */
    private function request(array $params, $format = 'json')
    {
        $params['token'] = $this->apiToken;
        $params['p'] = $format;

        $url = $this->baseUrl . '?' . http_build_query($params);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'ignore_errors' => true
            ]
        ]);

        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            throw new Exception('API请求失败，请检查网络连接');
        }

        if ($format === 'json' || $format === 'json2') {
            $data = json_decode($response, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('JSON解析失败: ' . json_last_error_msg());
            }
            return $data;
        }

        return ['raw' => $response];
    }

    /**
     * 获取支持的彩种列表
     * 
     * @return array
     */
    public static function getSupportedLotteries()
    {
        return self::$supportedLotteries;
    }

    /**
     * 检查彩种是否支持
     * 
     * @param string $lotteryType 彩种代码
     * @return bool
     */
    public static function isLotterySupported($lotteryType)
    {
        return isset(self::$supportedLotteries[$lotteryType]);
    }

    /**
     * 获取彩种名称
     * 
     * @param string $lotteryType 彩种代码
     * @return string|null
     */
    public static function getLotteryName($lotteryType)
    {
        return self::$supportedLotteries[$lotteryType] ?? null;
    }

    /**
     * 使用cURL执行请求（推荐用于生产环境）
     * 
     * @param array $params 请求参数
     * @param string $format 返回格式
     * @return array
     */
    public function requestWithCurl(array $params, $format = 'json')
    {
        $params['token'] = $this->apiToken;
        $params['p'] = $format;

        $url = $this->baseUrl . '?' . http_build_query($params);

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            throw new Exception('cURL请求失败: ' . $error);
        }

        if ($httpCode !== 200) {
            throw new Exception('API请求失败，HTTP状态码: ' . $httpCode);
        }

        if ($format === 'json' || $format === 'json2') {
            $data = json_decode($response, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('JSON解析失败: ' . json_last_error_msg());
            }
            return $data;
        }

        return ['raw' => $response];
    }
}
