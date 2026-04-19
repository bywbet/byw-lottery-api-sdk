# 错误码详解

**彩票API接口 - 错误码与解决方案**

当API调用出现错误时，会返回相应的错误码。本文档详细说明各种错误码的含义及处理方法。

---

## 目录

1. [错误响应格式](#错误响应格式)
2. [HTTP状态码](#http状态码)
3. [业务错误码](#业务错误码)
4. [常见错误处理](#常见错误处理)

---

## 错误响应格式

当请求出错时，API会返回以下格式的错误信息：

```json
{
  "error": true,
  "code": "1001",
  "message": "Token无效",
  "timestamp": 1713465600
}
```

---

## HTTP状态码

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | 正常处理响应数据 |
| 400 | 请求错误 | 检查请求参数格式 |
| 401 | 未授权 | 检查Token是否正确 |
| 403 | 禁止访问 | 检查账户权限 |
| 404 | 接口不存在 | 检查API地址 |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器错误 | 联系技术支持 |
| 503 | 服务不可用 | 稍后重试 |

---

## 业务错误码

### 认证错误 (1000-1099)

| 错误码 | 说明 | 原因 | 解决方案 |
|--------|------|------|----------|
| 1001 | Token无效 | Token不存在或格式错误 | 检查Token是否正确 |
| 1002 | Token已过期 | Token超过有效期 | 续费或重新获取Token |
| 1003 | Token被禁用 | 账户异常 | 联系客服处理 |
| 1004 | IP未授权 | 请求IP不在白名单 | 添加IP到白名单 |
| 1005 | 签名验证失败 | 签名计算错误 | 检查签名算法 |

### 参数错误 (2000-2099)

| 错误码 | 说明 | 原因 | 解决方案 |
|--------|------|------|----------|
| 2001 | 缺少必填参数 | 未传入必要参数 | 检查请求参数 |
| 2002 | 参数格式错误 | 参数格式不符合要求 | 按文档要求格式化 |
| 2003 | 参数值超出范围 | 参数值不在有效范围 | 检查参数取值 |
| 2004 | 彩种不存在 | 彩种代码错误 | 使用正确的彩种代码 |
| 2005 | 日期格式错误 | 日期格式不正确 | 使用YYYYMMDD格式 |
| 2006 | 日期超出范围 | 查询日期无数据 | 选择有效的日期范围 |

### 业务错误 (3000-3099)

| 错误码 | 说明 | 原因 | 解决方案 |
|--------|------|------|----------|
| 3001 | 暂无开奖数据 | 该时段无开奖 | 等待开奖后重试 |
| 3002 | 数据获取失败 | 服务器异常 | 重试或联系客服 |
| 3003 | 超出调用限制 | 频率超限/额度用尽 | 降低频率/升级套餐 |
| 3004 | 功能未开通 | 该功能需要付费 | 开通相应服务 |
| 3005 | 数据同步中 | 正在同步数据 | 稍后重试 |

### 系统错误 (5000-5099)

| 错误码 | 说明 | 原因 | 解决方案 |
|--------|------|------|----------|
| 5001 | 服务器内部错误 | 程序异常 | 重试或联系客服 |
| 5002 | 数据库错误 | 数据查询异常 | 重试或联系客服 |
| 5003 | 缓存服务异常 | Redis等缓存不可用 | 稍后重试 |
| 5004 | 第三方服务异常 | 依赖服务不可用 | 稍后重试 |

---

## 常见错误处理

### 错误码1001: Token无效

**错误信息**:
```json
{
  "error": true,
  "code": "1001",
  "message": "Token无效"
}
```

**可能原因**:
1. Token拼写错误
2. Token已被删除
3. Token格式不正确

**解决方法**:
```csharp
// 确认Token正确性
var token = "97ea1teb952bv903"; // 确认这是正确的Token
var client = new BywClient(token);
```

### 错误码1004: IP未授权

**错误信息**:
```json
{
  "error": true,
  "code": "1004",
  "message": "请求IP未在白名单中"
}
```

**解决方法**:
1. 登录官网后台
2. 进入API设置
3. 添加当前服务器IP到白名单

### 错误码2004: 彩种不存在

**错误信息**:
```json
{
  "error": true,
  "code": "2004",
  "message": "彩种不存在"
}
```

**解决方法**:
```csharp
// 使用正确的彩种代码
var validCodes = BywClient.GetSupportedLotteries();
// { "cqssc": "重庆时时彩", "gd11x5": "广东11选5", ... }
```

### 错误码3001: 暂无开奖数据

**错误信息**:
```json
{
  "error": true,
  "code": "3001",
  "message": "暂无开奖数据"
}
```

**可能原因**:
1. 彩票已停售
2. 非开奖时间
3. 数据尚未同步

**解决方法**:
```php
// 等待几秒后重试
sleep(5);
$result = $client->getLatest('cqssc');
```

### 错误码3003: 超出调用限制

**错误信息**:
```json
{
  "error": true,
  "code": "3003",
  "message": "超出调用频率限制"
}
```

**解决方法**:
```csharp
// 实现请求限流
private static SemaphoreSlim _semaphore = new SemaphoreSlim(5);

await _semaphore.WaitAsync();
try {
    var result = await client.GetLatestAsync("cqssc");
}
finally {
    await Task.Delay(200); // 增加延迟
    _semaphore.Release();
}
```

---

## 错误处理代码示例

### C# 统一错误处理

```csharp
public async Task<LotteryResult> SafeGetLatestAsync(string lotteryType)
{
    try
    {
        return await _client.GetLatestAsync(lotteryType);
    }
    catch (HttpRequestException ex)
    {
        _logger.LogError($"网络错误: {ex.Message}");
        return null;
    }
    catch (Exception ex) when (ex.Message.Contains("Token"))
    {
        _logger.LogError("Token无效，请检查配置");
        throw;
    }
}
```

### PHP 统一错误处理

```php
function safeGetLatest($client, $lotteryType) {
    try {
        return $client->getLatest($lotteryType);
    } catch (Exception $e) {
        $message = $e->getMessage();
        
        if (strpos($message, 'Token') !== false) {
            throw new Exception('API Token无效');
        }
        
        // 记录日志并返回null
        error_log("API错误: " . $message);
        return null;
    }
}
```

### JavaScript 统一错误处理

```javascript
async function safeLatest(client, lotteryType) {
    try {
        return await client.latest(lotteryType);
    } catch (error) {
        if (error.message.includes('Token')) {
            throw new Error('API Token无效');
        }
        
        console.error('API错误:', error.message);
        return null;
    }
}
```

---

## 获取帮助

如果遇到本文档未涵盖的错误，请联系技术支持：

- 📧 邮箱: bywbet@gmail.com
- 💬 工单: 后台提交工单
- 📖 在线文档: https://www.byw.bet/docs/show.html
