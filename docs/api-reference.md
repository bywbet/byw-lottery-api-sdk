# API接口详细文档

**彩票开奖数据API接口参考**

本页面提供彩票API接口的详细技术文档。

---

## 目录

1. [基础信息](#基础信息)
2. [接口列表](#接口列表)
3. [请求签名](#请求签名)
4. [频率限制](#频率限制)
5. [Webhooks](#webhooks)
6. [SDK下载](#sdk下载)

---

## 基础信息

### 服务器地址

```
生产环境: http://api.byw.bet:868/api
```

### 认证方式

API采用Token认证方式，所有请求需要在URL参数中携带有效的API Token。

```
?token=YOUR_API_TOKEN
```

### 数据格式

| 格式 | 参数值 | Content-Type |
|------|--------|--------------|
| JSON | json | application/json |
| 增强JSON | json2 | application/json |
| XML | xml | application/xml |
| JSONP | jsonp | application/javascript |

---

## 接口列表

### 获取开奖数据

**接口地址**: `/api`

**请求方式**: `GET`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| token | string | ✅ | API接口密钥 |
| t | string | ✅ | 彩种代码 |
| p | string | ✅ | 返回格式(json/xml/json2/jsonp) |
| limit | int | ❌ | 返回条数(1-20,默认1) |
| nexttime | int | ❌ | 是否返回下一期时间(1=返回) |
| date | string | ❌ | 指定日期(YYYYMMDD) |

**请求示例**:

```
http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=5&p=json
```

**成功响应**:

```json
{
  "Rows": 5,
  "T": "cqssc",
  "Nexttime": "2026-04-18 22:10:00",
  "Data": [
    {
      "Expect": "20260418053",
      "Opencode": "9,0,0,1,1",
      "Opentime": "2026-04-18 21:50:03"
    }
  ]
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| Rows | int | 返回数据条数 |
| T | string | 彩种代码 |
| Nexttime | string | 下一期开奖时间(需请求nexttime=1) |
| Data | array | 开奖数据数组 |
| Data[].Expect | string | 期号 |
| Data[].Opencode | string | 开奖号码 |
| Data[].Opentime | string | 开奖时间 |

---

### 获取支持的彩种

本SDK提供 `GetSupportedLotteries()` 方法获取支持的彩种列表（共109个 cstatus=1 的彩种）。

```csharp
var lotteries = BywClient.GetSupportedLotteries();
foreach (var kv in lotteries)
{
    Console.WriteLine($"{kv.Key}: {kv.Value}");
}
```

完整彩种列表请参考 [README.md](../../README.md#-支持的彩种)。

---

## 请求签名

### 安全建议

1. **Token安全**: 请勿在前端代码中暴露API Token
2. **HTTPS**: 生产环境建议使用HTTPS传输
3. **IP白名单**: 可在后台设置IP访问限制
4. **请求日志**: 建议记录API调用日志

### 前端安全调用

前端调用建议通过后端代理:

```
前端 -> 你的服务器 -> 彩票API -> 你的服务器 -> 前端
```

---

## 频率限制

| 套餐类型 | QPS限制 | 日请求限制 |
|----------|---------|-----------|
| 免费版 | 5次/秒 | 1000次/日 |
| 基础版 | 20次/秒 | 10000次/日 |
| 专业版 | 100次/秒 | 无限制 |

### 超限处理

当请求超出频率限制时，API会返回429状态码。建议实现请求队列和缓存策略。

---

## Webhooks

### 实时推送（可选功能）

支持Webhook实时推送开奖数据，需要在后台开启并配置回调地址。

**推送数据格式**:

```json
{
  "type": "lottery_open",
  "lottery": "cqssc",
  "expect": "20260418053",
  "opencode": "9,0,0,1,1",
  "opentime": "2026-04-18 21:50:03",
  "nexttime": "2026-04-18 22:10:00"
}
```

---

## SDK下载

### C# SDK

```csharp
// NuGet
Install-Package BywLottery.SDK

// 或手动引用 src/csharp/
```

### PHP SDK

```php
// Composer
composer require byw/lottery-api-sdk

// 或手动引用 src/php/
```

### JavaScript SDK

```javascript
// NPM
npm install byw-lottery-api-sdk

// 或手动引用 src/javascript/
```

---

## 技术支持

- 📧 邮箱: bywbet@gmail.com
- 💬 工单: 后台提交工单
- 📖 文档: https://www.byw.bet/show.html
