# C# 彩票API调用示例

本目录包含 **C# 彩票开奖数据API** 的完整调用示例。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [错误码说明](../../docs/error-codes.md)

## 🚀 快速开始

### 1. 安装SDK

复制 `src/csharp/` 目录到你的项目中，或通过 NuGet 引用。

### 2. 基本使用

```csharp
using BywLottery.SDK;

// 初始化客户端
var client = new BywClient("YOUR_API_TOKEN");

// 获取最新开奖数据
var latest = await client.GetLatestAsync("4"); // 重庆时时彩
Console.WriteLine($"期号: {latest.Expect}");
Console.WriteLine($"开奖号码: {latest.Opencode}");
Console.WriteLine($"开奖时间: {latest.Opentime}");
```

### 3. 获取多期数据

```csharp
// 获取最近5期开奖数据
var results = await client.GetLatestMultiAsync("4", limit: 5); // 重庆时时彩
foreach (var item in results)
{
    Console.WriteLine($"{item.Expect}: {item.Opencode}");
}
```

### 4. 获取指定日期数据

```csharp
// 查询2026年4月18日的开奖记录
var history = await client.GetHistoryByDateAsync("4", new DateTime(2026, 4, 18)); // 重庆时时彩
foreach (var item in history)
{
    Console.WriteLine($"{item.Expect}: {item.Opencode}");
}
```

### 5. 获取历史数据

```csharp
// 获取最近10期历史数据
var history = await client.GetHistoryAsync("4", limit: 10); // 重庆时时彩
```

## 🔧 完整示例

```csharp
using System;
using System.Threading.Tasks;
using BywLottery.SDK;

class Program
{
    static async Task Main(string[] args)
    {
        // 初始化SDK
        var client = new BywClient("YOUR_API_TOKEN");

        try
        {
            // 获取最新开奖结果
            Console.WriteLine("=== 获取最新开奖数据 ===");
            var latest = await client.GetLatestAsync("4"); // 重庆时时彩
            if (latest != null)
            {
                Console.WriteLine($"彩种: 重庆时时彩");
                Console.WriteLine($"期号: {latest.Expect}");
                Console.WriteLine($"开奖号码: {latest.Opencode}");
                Console.WriteLine($"开奖时间: {latest.Opentime}");
            }

            // 获取多期数据
            Console.WriteLine("\n=== 最近5期开奖数据 ===");
            var results = await client.GetLatestMultiAsync("4", limit: 5); // 重庆时时彩
            foreach (var item in results)
            {
                Console.WriteLine($"{item.Expect} - {item.Opencode}");
            }

            // 获取支持彩种列表
            Console.WriteLine("\n=== 支持的彩种 ===");
            var lotteries = BywClient.GetSupportedLotteries();
            foreach (var kv in lotteries)
            {
                Console.WriteLine($"{kv.Key}: {kv.Value}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"错误: {ex.Message}");
        }
    }
}
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
3. **数据缓存**: 根据需求适当缓存开奖数据
4. **错误处理**: 务必做好异常捕获

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- GitHub: https://github.com/your-repo/byw-lottery-api-sdk
