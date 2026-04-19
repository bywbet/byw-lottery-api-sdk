# PHP 彩票API调用示例

本目录包含 **PHP 彩票开奖数据API** 的完整调用示例。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [错误码说明](../../docs/error-codes.md)

## 🚀 快速开始

### 1. 安装SDK

```bash
# 复制SDK文件到你的项目
cp -r src/php/ your-project/
```

### 2. 基本使用

```php
<?php
require_once __DIR__ . '/../../src/php/BywClient.php';

use BywLottery\SDK\BywClient;

// 初始化客户端
$client = new BywClient('YOUR_API_TOKEN');

// 获取最新开奖数据
$result = $client->getLatest('4'); // 重庆时时彩

echo "期号: " . $result['Expect'];
echo "开奖号码: " . $result['Opencode'];
```

### 3. 获取多期数据

```php
// 获取最近5期开奖数据
$results = $client->getLatestMulti('4', 5); // 重庆时时彩
foreach ($results as $item) {
    echo $item['Expect'] . " - " . $item['Opencode'];
}
```

### 4. 获取指定日期数据

```php
// 查询2026年4月18日的开奖记录
$results = $client->getByDate('4', '2026-04-18'); // 重庆时时彩
```

### 5. 使用cURL（生产环境推荐）

```php
$result = $client->requestWithCurl([
    't' => '4', // 重庆时时彩
    'limit' => 5
]);
```

## 📊 支持的彩种

> 共支持 **109个** 彩种

### 时时彩系列

| 代码 | 名称 |
|------|------|
| 4 | 重庆时时彩(欢乐生肖) |
| 5 | 新疆时时彩 |
| 1 | 黑龙江时时彩 |
| 3 | 天津时时彩 |
| 103 | 168极速时时彩 |
| 132 | 腾讯分分彩(奇趣) |

### PK10/赛车系列

| 代码 | 名称 |
|------|------|
| 8 | 北京赛车(PK10) |
| 112 | 幸运飞艇 |
| 102 | 168极速赛车(PK10) |

### 11选5系列

| 代码 | 名称 |
|------|------|
| 59 | 广东11选5 |
| 60 | 山东11选5 |
| 55 | 江西11选5 |
| 52 | 江苏11选5 |

### 快三系列

| 代码 | 名称 |
|------|------|
| 78 | 江苏快三 |
| 85 | 安徽快三 |
| 84 | 湖北快三 |

### 传统彩票

| 代码 | 名称 |
|------|------|
| 21 | 福彩3D |
| 25 | 排列三 |
| 22 | 双色球 |

> 完整彩种列表请参考 [主README](../../README.md#-支持的彩种)

## ⚠️ 注意事项

1. **API Token安全**: 不要在前端代码中暴露Token
2. **建议服务端调用**: 优先通过服务端调用API
3. **cURL扩展**: 生产环境建议启用cURL扩展
4. **错误处理**: 务必做好异常捕获

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/docs/show.html
