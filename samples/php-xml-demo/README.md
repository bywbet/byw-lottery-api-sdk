# PHP XML 彩票数据采集示例

本目录包含 **PHP** 彩票开奖数据 API 的 XML 格式采集示例。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [PHP SDK 文档](../../src/php/BywClient.php)
- [PHP 示例目录](../php-demo/)

## 🎯 功能特性

- **XML 格式解析** - 使用 SimpleXML 解析 XML 数据
- **自动刷新** - 支持自动刷新页面获取最新数据
- **数据展示** - 清晰展示开奖期号、号码、时间
- **多彩种支持** - 支持 109 个彩票品种

## 🚀 快速开始

### 1. 环境要求

- PHP 5.6+
- PHP SimpleXML 扩展
- cURL 扩展（可选）

### 2. 使用方法

1. 修改代码中的 API 地址，填入有效的 Token
2. 确保 PHP 环境已启用 SimpleXML 扩展
3. 通过 Web 服务器访问 `php-xml.php` 文件
4. 或使用命令行：`php php-xml.php`

### 3. API 地址配置

```php
// 付费接口
$src = 'http://api.byw.bet:868/api?token=您的TOKEN&t=4&limit=10&p=xml';

// 免费接口（部分彩种）
// $src = 'http://api.byw.bet:868/api?token=您的TOKEN&t=4&limit=10&p=xml&type=free';
```

### 4. 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| token | API Token | 您的API令牌 |
| t | 彩种ID (lotteryid) | 4 (重庆时时彩) |
| limit | 返回数量 | 10 |
| p | 返回格式 | xml |
| type | 接口类型 | free (免费接口) |

## 📊 彩种代码参考

> 使用数据库 `lotteryid` 作为彩种代码

| 彩种 | lotteryid |
|------|-----------|
| 重庆时时彩 | 4 |
| 新疆时时彩 | 5 |
| 黑龙江时时彩 | 1 |
| 天津时时彩 | 3 |
| 广东11选5 | 59 |
| 山东11选5 | 60 |
| 江西11选5 | 55 |
| 江苏11选5 | 52 |
| 安徽快三 | 85 |
| 江苏快三 | 78 |
| 湖北快三 | 84 |
| 北京赛车(PK10) | 8 |
| 幸运飞艇 | 112 |
| 168极速赛车 | 102 |
| 168极速时时彩 | 103 |
| 澳洲幸运10 | 115 |
| 台湾賓果 | 117 |
| 香港⑥合彩 | 111 |
| 福彩3D | 21 |
| 双色球 | 22 |
| 大乐透 | 24 |

> 完整彩种列表请参考 [主README](../../README.md#-支持的彩种)

## 📝 核心代码说明

### XML 数据解析

```php
// 防止本地缓存，增加随机数
$src .= (strpos($src, '?') > 0 ? '&' : '?') . '_=' . time();

// 获取数据
$html = file_get_contents($src);

// 解析 XML
$xml = json_decode(json_encode(simplexml_load_string($html)), true);

// 检查数据
if (isset($xml['@attributes']['row'])) {
    echo "共采集到 {$xml['@attributes']['row']} 行开奖数据：<br/>";
    
    foreach ($xml['row'] as $r) {
        $expect = preg_replace("/^(\d{8})(\d{3})$/", "\\1-\\2", $r['@attributes']['expect']);
        $opencode = $r['@attributes']['opencode'];
        $opentime = $r['@attributes']['opentime'];
        
        echo "开奖期号：{$expect}<br/>";
        echo "开奖号码：{$opencode}<br/>";
        echo "开奖时间：{$opentime}<br/><br/>";
        
        // TODO: 分析数据、对比数据，并写入数据库
    }
}
```

### 使用 cURL（替代 file_get_contents）

```php
function curlGet($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

$html = curlGet($src);
```

## 🔧 项目结构

```
php-xml-demo/
├── php-xml.php          # XML采集示例
└── README.md            # 本文件
```

## ⚠️ 注意事项

1. **Token 安全** - 请勿将 API Token 提交到公开代码库
2. **缓存处理** - 添加随机参数防止 GET 请求缓存
3. **错误处理** - 建议添加超时和重试机制
4. **编码问题** - 确保 PHP 使用 UTF-8 编码

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- PHP SDK: [BywClient.php](../../src/php/BywClient.php)

---

## SEO 关键词

彩票API接口, PHP XML解析, SimpleXML使用, PHP数据采集, XML格式接口, PHP彩票接口, 博彩API, cURL使用, PHP时时彩, PHP 11选5, PHP快三, PHP开奖结果, PHP数据抓取, Web数据采集, PHP网络请求
