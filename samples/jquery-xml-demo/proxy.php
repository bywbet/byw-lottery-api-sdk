<?php
/**
 * 彩票API代理服务
 *
 * 用于解决前端跨域请求XML接口的限制
 * 将前端请求转发到目标API并返回结果
 *
 * @author BYW Lottery SDK
 * @version 1.0.0
 */

// 设置响应头
header('Content-Type: text/xml; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// 允许请求的最大执行时间（秒）
set_time_limit(30);

// 获取请求参数
$src = isset($_GET['src']) ? $_GET['src'] : '';

// 安全检查：验证请求来源
if (empty($src)) {
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>错误：未指定请求地址</error>';
    exit;
}

// 验证URL格式
if (!filter_var($src, FILTER_VALIDATE_URL)) {
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>错误：无效的请求地址</error>';
    exit;
}

// 只允许代理到指定域名（安全限制）
$allowedHosts = ['api.byw.bet', 'api.byw.com', 'localhost', '127.0.0.1'];
$parsedUrl = parse_url($src);
$host = isset($parsedUrl['host']) ? $parsedUrl['host'] : '';

// 检查是否为允许的域名
$isAllowed = false;
foreach ($allowedHosts as $allowedHost) {
    if (strpos($host, $allowedHost) !== false) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>错误：不允许代理到该域名</error>';
    exit;
}

// URL解码处理
$src = urldecode($src);

// 防止缓存，添加时间戳参数
$separator = (strpos($src, '?') !== false) ? '&' : '?';
$src .= $separator . '_=' . time();

// 初始化cURL
$ch = curl_init();

// 设置cURL选项
curl_setopt_array($ch, [
    CURLOPT_URL => $src,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_HTTPHEADER => [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept: application/xml, text/xml, */*',
        'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8'
    ]
]);

// 执行请求
$response = curl_exec($ch);

// 获取HTTP状态码
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// 获取错误信息
$curlError = curl_error($ch);
$curlErrno = curl_errno($ch);

// 关闭cURL
curl_close($ch);

// 处理响应
if ($curlErrno !== 0) {
    // cURL错误
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>网络错误：' . htmlspecialchars($curlError) . ' (代码: ' . $curlErrno . ')</error>';
    exit;
}

if ($httpCode !== 200) {
    // HTTP错误
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>请求失败：HTTP ' . $httpCode . '</error>';
    exit;
}

if (empty($response)) {
    // 空响应
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>错误：服务器返回空数据</error>';
    exit;
}

// 验证响应是否为有效的XML
libxml_use_internal_errors(true);
$xml = simplexml_load_string($response);
if ($xml === false) {
    $errors = libxml_get_errors();
    libxml_clear_errors();
    echo '<?xml version="1.0" encoding="utf-8"?>';
    echo '<error>错误：数据格式解析失败</error>';
    exit;
}

// 输出响应内容
echo $response;
?>
