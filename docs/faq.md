# 常见问题FAQ

**彩票API接口 - 常见问题解答**

本页面收集了开发者在使用彩票开奖数据API时最常遇到的问题。

---

## 目录

1. [基础问题](#基础问题)
2. [接入问题](#接入问题)
3. [技术问题](#技术问题)
4. [付费问题](#付费问题)

---

## 基础问题

### Q1: 如何获取API Token？

**A:** 请访问 [博易网官网](https://www.byw.bet) 完成注册后，在后台API管理页面获取您的API密钥。

### Q2: 彩票API怎么对接？

**A:** 对接步骤如下：
1. 注册账号并获取API Token
2. 选择适合您技术栈的SDK（C#/PHP/JS）
3. 初始化SDK客户端
4. 调用 `getLatest()` 或 `latest()` 获取开奖数据
5. 处理返回的JSON数据

### Q3: 如何获取实时开奖数据？

**A:** 使用API的 `limit` 参数可以控制返回条数：

```
http://api.byw.bet:868/api?token=YOUR_TOKEN&t=cqssc&limit=5&p=json
```

这将返回最近5期的开奖数据。

### Q4: API返回的数据格式是怎样的？

**A:** 默认返回JSON格式：

```json
{
  "Rows": 2,
  "T": "cqssc",
  "Data": [
    {
      "Expect": "20260418053",
      "Opencode": "9,0,0,1,1",
      "Opentime": "2026-04-18 21:50:03"
    }
  ]
}
```

---

## 接入问题

### Q5: C#彩票接口调用示例？

**A:**

```csharp
using BywLottery.SDK;

var client = new BywClient("YOUR_TOKEN");
var result = await client.GetLatestAsync("cqssc");
Console.WriteLine(result.Opencode);
```

详见: [C# SDK使用指南](./sdk-guide.md#c-sdk)

### Q6: PHP彩票开奖数据获取示例？

**A:**

```php
$client = new BywClient('YOUR_TOKEN');
$result = $client->getLatest('cqssc');
echo $result['Opencode'];
```

详见: [PHP SDK使用指南](./sdk-guide.md#php-sdk)

### Q7: JavaScript/Node.js如何调用？

**A:**

```javascript
const client = new BywClient('YOUR_TOKEN');
const result = await client.latest('cqssc');
console.log(result.Opencode);
```

详见: [JavaScript SDK使用指南](./sdk-guide.md#javascript-sdk)

### Q8: JSON彩票开奖API示例？

**A:**

```bash
# 直接使用curl调用
curl "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=cqssc&limit=5&p=json"
```

```javascript
// jQuery调用
$.getJSON('http://api.byw.bet:868/api', {
    token: 'YOUR_TOKEN',
    t: 'cqssc',
    limit: 5
}, function(data) {
    console.log(data.Data);
});
```

### Q9: 如何在前端JavaScript中跨域调用？

**A:** 有三种方案：

**方案一：JSONP**
```
?p=jsonp&callback=?
```

**方案二：后端代理（推荐）**

前端 → 你的服务器 → 彩票API → 你的服务器 → 前端

**方案三：CORS**

在后端添加CORS响应头。

### Q10: 如何查询指定日期的开奖数据？

**A:**

```
?date=20260418
```

日期格式为 `YYYYMMDD`。

```csharp
var results = await client.GetHistoryByDateAsync("cqssc", new DateTime(2026, 4, 18));
```

---

## 技术问题

### Q11: API请求频率有限制吗？

**A:** 不同套餐有不同的QPS限制：
- 免费版：5次/秒
- 基础版：20次/秒
- 专业版：100次/秒

超出限制会返回429错误。

### Q12: 如何避免超出频率限制？

**A:** 建议措施：
1. 实现本地缓存，减少API调用
2. 使用请求队列控制并发
3. 批量获取多期数据而非频繁查询

### Q13: 开奖数据有延迟吗？

**A:** 官方数据通常在开奖后30秒内同步，延迟极低。

### Q14: 支持哪些彩票类型？

**A:** 支持的彩种包括：
- 时时彩：重庆、天津、新疆
- 11选5：广东、山东、江西
- 快三：安徽、江苏、湖北
- 排列三/五
- 福彩3D
- 双色球、七乐彩

完整列表请使用 `GetSupportedLotteries()` 方法获取。

### Q15: 如何处理网络异常？

**A:**

```csharp
try {
    var result = await client.GetLatestAsync("cqssc");
}
catch (HttpRequestException) {
    // 网络异常处理
    await Task.Delay(1000);
    result = await client.GetLatestAsync("cqssc");
}
```

### Q16: 数据如何缓存以提高性能？

**A:**

```csharp
private static IMemoryCache _cache;

public async Task<LotteryResult> GetCachedLatest(string lotteryType)
{
    var key = $"lottery_{lotteryType}";
    
    if (!_cache.TryGetValue(key, out LotteryResult result))
    {
        result = await _client.GetLatestAsync(lotteryType);
        _cache.Set(key, result, TimeSpan.FromMinutes(1));
    }
    
    return result;
}
```

### Q17: 如何在ASP.NET Core中集成？

**A:** 在 `Startup.cs` 中配置：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<BywClient>(sp => 
        new BywClient(Configuration["Byw:Token"]));
}
```

### Q18: PHP中使用cURL有什么好处？

**A:** cURL相比file_get_contents：
1. 支持更长的超时时间
2. 支持SSL证书验证
3. 支持更多HTTP特性
4. 更好的错误处理

---

## 付费问题

### Q19: API使用需要付费吗？

**A:** 提供免费套餐，有每日调用次数限制。需要更多额度可升级付费套餐。

### Q20: 如何升级到付费套餐？

**A:** 登录官网后台，进入套餐管理页面选择升级。

### Q21: 可以测试后再购买吗？

**A:** 可以，注册后自动获得免费试用额度。

### Q22: 如何查看我的使用量？

**A:** 在官网后台的API管理页面可以查看调用统计。

---

## SEO相关关键词

本页面覆盖的搜索词：
- 彩票API怎么对接
- 如何获取实时开奖数据
- API返回数据格式说明
- C#彩票接口调用
- PHP彩票开奖数据获取
- JSON彩票开奖API示例
- 彩票API频率限制
- 开奖数据缓存策略

---

## 获取更多帮助

- 📖 [API接口文档](./api-reference.md)
- 💻 [SDK使用指南](./sdk-guide.md)
- ⚠️ [错误码详解](./error-codes.md)
- 📧 技术支持: bywbet@gmail.com
