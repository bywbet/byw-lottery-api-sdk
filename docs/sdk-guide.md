# SDK使用指南

**彩票数据SDK - 多语言开发教程**

本文档详细介绍如何使用博易网彩票开奖数据SDK进行开发。

---

## 目录

1. [C# SDK](#c-sdk)
2. [PHP SDK](#php-sdk)
3. [JavaScript SDK](#javascript-sdk)
4. [最佳实践](#最佳实践)
5. [常见问题](#常见问题)

---

## C# SDK

### 环境要求

- .NET Framework 4.5+ 或 .NET Core 2.0+

### 安装方式

**方式一：NuGet安装**

```bash
Install-Package BywLottery.SDK
```

**方式二：手动引用**

复制 `src/csharp/` 目录下的所有文件到项目中。

### 基础使用

```csharp
using BywLottery.SDK;

// 初始化客户端
var client = new BywClient("YOUR_API_TOKEN");

// 获取最新开奖数据
var result = await client.GetLatestAsync("4"); // 重庆时时彩
Console.WriteLine(result.Expect);
Console.WriteLine(result.Opencode);
```

### 完整示例

```csharp
using System;
using System.Threading.Tasks;
using BywLottery.SDK;

class Program
{
    static async Task Main(string[] args)
    {
        var client = new BywClient("YOUR_API_TOKEN");
        
        try
        {
            // 获取最新一期
            var latest = await client.GetLatestAsync("4"); // 重庆时时彩
            Console.WriteLine($"期号: {latest.Expect}");
            Console.WriteLine($"号码: {latest.Opencode}");
            
            // 获取多期数据
            var list = await client.GetLatestMultiAsync("4", 5); // 重庆时时彩
            foreach (var item in list)
            {
                Console.WriteLine($"{item.Expect}: {item.Opencode}");
            }
            
            // 历史查询
            var history = await client.GetHistoryByDateAsync(
                "4", // 重庆时时彩
                new DateTime(2026, 4, 18)
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"错误: {ex.Message}");
        }
    }
}
```

### 方法列表

| 方法 | 说明 | 参数 |
|------|------|------|
| GetLatestAsync | 获取最新一期 | lotteryType, includeNextTime |
| GetLatestMultiAsync | 获取多期 | lotteryType, limit, includeNextTime |
| GetHistoryByDateAsync | 指定日期查询 | lotteryType, date |
| GetHistoryAsync | 历史记录 | lotteryType, limit |
| GetSupportedLotteries | 获取支持的彩种 | - |

---

## PHP SDK

### 环境要求

- PHP 7.0+

### 安装方式

**方式一：Composer**

```bash
composer require byw/lottery-api-sdk
```

**方式二：手动安装**

复制 `src/php/` 目录到项目中。

### 基础使用

```php
<?php
require_once 'BywClient.php';

use BywLottery\SDK\BywClient;

// 初始化客户端
$client = new BywClient('YOUR_API_TOKEN');

// 获取最新开奖数据
$result = $client->getLatest('4'); // 重庆时时彩
echo $result['Expect'];
echo $result['Opencode'];
```

### 完整示例

```php
<?php
require_once 'BywClient.php';

use BywLottery\SDK\BywClient;

try {
    $client = new BywClient('YOUR_API_TOKEN');
    
    // 获取最新一期
    $latest = $client->getLatest('4'); // 重庆时时彩
    echo "期号: " . $latest['Expect'] . "\n";
    echo "号码: " . $latest['Opencode'] . "\n";
    
    // 获取多期数据
    $list = $client->getLatestMulti('4', 5); // 重庆时时彩
    foreach ($list as $item) {
        echo $item['Expect'] . ": " . $item['Opencode'] . "\n";
    }
    
    // 指定日期查询
    $history = $client->getByDate('4', '2026-04-18'); // 重庆时时彩
    
    // 历史记录
    $history = $client->getHistory('4', 10); // 重庆时时彩
    
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
}
```

### 使用cURL（生产环境推荐）

```php
$result = $client->requestWithCurl([
    't' => '4', // 重庆时时彩
    'limit' => 5
]);
```

### 方法列表

| 方法 | 说明 | 参数 |
|------|------|------|
| getLatest | 获取最新一期 | $lotteryType, $includeNextTime |
| getLatestMulti | 获取多期 | $lotteryType, $limit, $includeNextTime |
| getByDate | 指定日期查询 | $lotteryType, $date |
| getHistory | 历史记录 | $lotteryType, $limit |
| requestWithCurl | cURL请求 | $params, $format |
| getSupportedLotteries | 获取支持的彩种 | - |

---

## JavaScript SDK

### 环境要求

- Node.js 12+ 或现代浏览器

### 安装方式

**方式一：NPM**

```bash
npm install byw-lottery-api-sdk
```

**方式二：手动安装**

复制 `src/javascript/` 目录到项目中。

### 基础使用（Node.js）

```javascript
const BywClient = require('byw-lottery-api-sdk');

const client = new BywClient('YOUR_API_TOKEN');

const result = await client.latest('4'); // 重庆时时彩
console.log(result.Expect);
console.log(result.Opencode);
```

### 完整示例

```javascript
const BywClient = require('byw-lottery-api-sdk');

async function main() {
    const client = new BywClient('YOUR_API_TOKEN');
    
    try {
        // 获取最新一期
        const latest = await client.latest('4'); // 重庆时时彩
        console.log(`期号: ${latest.Expect}`);
        console.log(`号码: ${latest.Opencode}`);
        
        // 获取多期数据
        const list = await client.latestMulti('4', 5); // 重庆时时彩
        list.forEach(item => {
            console.log(`${item.Expect}: ${item.Opencode}`);
        });
        
        // 指定日期查询
        const history = await client.byDate('4', '2026-04-18'); // 重庆时时彩
        
        // 历史记录
        const history = await client.history('4', 10); // 重庆时时彩
        
    } catch (e) {
        console.error('错误:', e.message);
    }
}

main();
```

### 浏览器端使用（JSONP）

```html
<script src="byw-lottery-sdk.min.js"></script>
<script>
    const client = new BywClient('YOUR_TOKEN', {
        format: 'jsonp'
    });
    
    client.latest('4').then(result => { // 重庆时时彩
        console.log(result);
    });
</script>
```

### 方法列表

| 方法 | 说明 | 参数 |
|------|------|------|
| latest | 获取最新一期 | lotteryType, includeNextTime |
| latestMulti | 获取多期 | lotteryType, limit, includeNextTime |
| byDate | 指定日期查询 | lotteryType, date |
| history | 历史记录 | lotteryType, limit |
| nextDrawTime | 获取下一期时间 | lotteryType |

---

## 最佳实践

### 1. Token管理

```csharp
// 推荐：将Token存储在配置文件中
var token = ConfigurationManager.AppSettings["BywApiToken"];
var client = new BywClient(token);
```

### 2. 异常处理

```csharp
try {
    var result = await client.GetLatestAsync("4"); // 重庆时时彩
}
catch (HttpRequestException ex) {
    // 网络错误处理
    Console.WriteLine($"网络错误: {ex.Message}");
}
catch (Exception ex) {
    // 其他错误处理
    Console.WriteLine($"错误: {ex.Message}");
}
```

### 3. 数据缓存

```csharp
// 建议缓存开奖数据，减少API调用
var cache = MemoryCache.Default;
var key = $"lottery_4_{DateTime.Now:yyyyMMddHHmm}";

if (!cache.Contains(key)) {
    var result = await client.GetLatestAsync("4"); // 重庆时时彩
    cache.Add(key, result, DateTimeOffset.Now.AddMinutes(1));
}

var data = cache.Get(key) as LotteryResult;
```

### 4. 频率控制

```csharp
// 使用SemaphoreSlim控制并发
private static SemaphoreSlim semaphore = new SemaphoreSlim(5);

await semaphore.WaitAsync();
try {
    var result = await client.GetLatestAsync("4"); // 重庆时时彩
}
finally {
    semaphore.Release();
}
```

---

## 常见问题

### Q: API返回null怎么办？

A: 检查以下几点：
1. Token是否有效
2. 彩种代码是否正确
3. 网络连接是否正常

### Q: 如何处理跨域问题？

A: 前端调用建议使用JSONP格式，或通过后端代理。

### Q: 请求频率有限制吗？

A: 根据套餐不同有限制，建议实现缓存策略。

### Q: 支持哪些彩种？

A: 使用 `GetSupportedLotteries()` 方法获取完整列表。

---

## 相关链接

- [API接口文档](./api-reference.md)
- [错误码说明](./error-codes.md)
- [常见问题FAQ](./faq.md)
- [官方SDK下载](https://github.com/your-repo/byw-lottery-api-sdk)
