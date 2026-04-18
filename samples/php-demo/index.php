<?php
/**
 * PHP彩票API调用示例
 * 
 * 官方文档: https://www.byw.bet
 * 
 * 核心功能: PHP实时开奖数据获取 | 历史开奖查询 | JSON/XML格式支持
 */

require_once __DIR__ . '/../../src/php/BywClient.php';

use BywLottery\SDK\BywClient;

// =============================================
// 示例1: 获取最新开奖数据
// =============================================
echo "=== 获取最新开奖数据 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 获取重庆时时彩最新开奖结果 (lotteryid: 4)
    $result = $client->getLatest('4');
    
    if ($result) {
        echo "期号: " . $result['Expect'] . "\n";
        echo "开奖号码: " . $result['Opencode'] . "\n";
        echo "开奖时间: " . $result['Opentime'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例2: 获取多期开奖数据
// =============================================
echo "\n=== 获取最近5期开奖数据 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 获取最近5期开奖数据 (lotteryid: 4)
    $results = $client->getLatestMulti('4', 5);
    
    foreach ($results as $item) {
        echo $item['Expect'] . " - " . $item['Opencode'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例3: 获取指定日期历史数据
// =============================================
echo "\n=== 查询指定日期开奖数据 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 查询2026年4月18日的开奖记录 (lotteryid: 4)
    $results = $client->getByDate('4', '2026-04-18');
    
    foreach ($results as $item) {
        echo $item['Expect'] . " - " . $item['Opencode'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例4: 获取历史开奖记录
// =============================================
echo "\n=== 获取历史开奖数据 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 获取最近10期历史数据 (lotteryid: 4)
    $results = $client->getHistory('4', 10);
    
    foreach ($results as $item) {
        echo $item['Expect'] . " - " . $item['Opencode'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例5: 获取下一期开奖时间
// =============================================
echo "\n=== 获取下一期开奖时间 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    $result = $client->getLatest('4', true);
    
    if ($result && isset($result['Nexttime'])) {
        echo "下一期开奖时间: " . $result['Nexttime'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例6: 使用cURL请求（生产环境推荐）
// =============================================
echo "\n=== 使用cURL请求 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 使用cURL执行请求
    $result = $client->requestWithCurl([
        't' => '4', // 重庆时时彩
        'limit' => 1
    ]);
    
    print_r($result);
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例7: 获取支持的所有彩种
// =============================================
echo "\n=== 支持的彩种列表 ===\n";

$lotteries = BywClient::getSupportedLotteries();

foreach ($lotteries as $code => $name) {
    echo "$code: $name\n";
}

// =============================================
// 示例8: 广东11选5开奖查询
// =============================================
echo "\n=== 广东11选5开奖查询 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // lotteryid: 59
    $result = $client->getLatest('59');
    
    if ($result) {
        echo "期号: " . $result['Expect'] . "\n";
        echo "开奖号码: " . $result['Opencode'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例9: 安徽快三开奖查询
// =============================================
echo "\n=== 安徽快三开奖查询 ===\n";

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // lotteryid: 85
    $result = $client->getLatest('85');
    
    if ($result) {
        echo "期号: " . $result['Expect'] . "\n";
        echo "开奖号码: " . $result['Opencode'] . "\n";
    }
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}

// =============================================
// 示例10: 封装为函数（实际项目参考）
// =============================================
echo "\n=== 封装示例函数 ===\n";

/**
 * 获取彩票开奖数据（封装示例）
 * 
 * @param string $lotteryType 彩种代码(lotteryid)
 * @param int $limit 数量
 * @return array
 */
function getLotteryData($lotteryType, $limit = 5)
{
    $client = new BywClient('YOUR_API_TOKEN');
    
    return [
        'code' => 0,
        'message' => 'success',
        'data' => $client->getLatestMulti($lotteryType, $limit)
    ];
}

// 调用示例 (重庆时时彩)
$result = getLotteryData('4', 5);
print_r($result);

echo "\n完成!\n";
