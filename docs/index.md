# 博易网彩票开奖数据API文档

**彩票API接口 - 实时开奖数据服务**

官方文档: https://www.byw.bet | API文档: https://www.byw.bet/docs/show.html

---

## 📋 目录

1. [概述](#概述)
2. [快速开始](#快速开始)
3. [API接口](#api接口)
4. [请求参数](#请求参数)
5. [响应格式](#响应格式)
6. [彩种列表](#彩种列表)
7. [错误码](#错误码)
8. [示例代码](#示例代码)

---

## 概述

博易网彩票开奖数据API为开发者提供**实时彩票开奖数据接口服务**，支持JSON、XML、JSON2、JSONP多种返回格式。

### 核心功能

- ⚡ **实时开奖数据** - 毫秒级响应，获取最新开奖结果
- 📊 **历史数据查询** - 支持指定日期查询历史开奖记录
- 🧩 **多语言支持** - 提供C#、PHP、JavaScript等多种SDK
- 📡 **高并发接口** - 稳定高效的API服务
- 🔗 **多格式支持** - JSON/XML/JSONP，满足不同场景

### 适用场景

- 彩票数据可视化系统
- 实时开奖监控平台
- 数据统计分析工具
- API聚合服务系统
- 自动化数据采集系统
- 彩票资讯网站

---

## 快速开始

### 1. 获取API Token

访问 [博易网官网](https://www.byw.bet) 注册并获取API接口密钥。

### 2. 发送请求

使用curl快速测试：

```bash
curl "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=cqssc&limit=5&p=json"
```

### 3. 查看结果

```json
{
  "Rows": 5,
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

## API接口

### 请求地址

```
http://api.byw.bet:868/api
```

### 请求方法

`GET` - 所有接口均使用GET方法

---

## 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| token | String | ✅ | API接口密钥 | 97ea1teb952bv903 |
| t | String | ✅ | 彩种代码 | cqssc |
| p | String | ✅ | 返回格式 | json |
| limit | Integer | ❌ | 返回条数（1-20） | 5 |
| nexttime | Integer | ❌ | 返回下一期时间（1=开启） | 1 |
| date | String | ❌ | 指定日期（YYYYMMDD） | 20260418 |

### 返回格式 (p参数)

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| json | JSON格式 | 后端开发首选 |
| json2 | 增强JSON | 推荐使用 |
| xml | XML格式 | 遗留系统兼容 |
| jsonp | JSONP跨域 | 前端JavaScript调用 |

---

## 响应格式

### JSON格式响应

```json
{
  "Rows": 2,
  "T": "cqssc",
  "nexttime": "2026-04-18 22:10:00",
  "Data": [
    {
      "Expect": "20260418053",
      "Opencode": "9,0,0,1,1",
      "Opentime": "2026-04-18 21:50:03"
    },
    {
      "Expect": "20260418052",
      "Opencode": "6,7,8,9,0",
      "Opentime": "2026-04-18 21:30:02"
    }
  ]
}
```

### XML格式响应

```xml
<?xml version="1.0" encoding="utf-8"?>
<Root>
  <Rows>2</Rows>
  <T>cqssc</T>
  <Nexttime>2026-04-18 22:10:00</Nexttime>
  <Data>
    <Row>
      <Expect>20260418053</Expect>
      <Opencode>9,0,0,1,1</Opencode>
      <Opentime>2026-04-18 21:50:03</Opentime>
    </Row>
  </Data>
</Root>
```

---

## 彩种列表

### 时时彩系列

| 代码 | 名称 | 开奖频率 | 号码个数 |
|------|------|----------|----------|
| cqssc | 重庆时时彩 | 10分钟/期 | 5个 |
| tjsssc | 天津时时彩 | 10分钟/期 | 5个 |
| xjssc | 新疆时时彩 | 10分钟/期 | 5个 |

### 11选5系列

| 代码 | 名称 | 开奖频率 | 号码个数 |
|------|------|----------|----------|
| gd11x5 | 广东11选5 | 20分钟/期 | 5个 |
| sd11x5 | 山东11选5 | 20分钟/期 | 5个 |
| jx11x5 | 江西11选5 | 20分钟/期 | 5个 |

### 快三系列

| 代码 | 名称 | 开奖频率 | 号码个数 |
|------|------|----------|----------|
| ahk3 | 安徽快三 | 10分钟/期 | 3个 |
| jsk3 | 江苏快三 | 10分钟/期 | 3个 |
| hbk3 | 湖北快三 | 10分钟/期 | 3个 |

### 其他彩种

| 代码 | 名称 | 开奖频率 | 号码个数 |
|------|------|----------|----------|
| pl3 | 排列三 | 每日 | 3个 |
| pl5 | 排列五 | 每日 | 5个 |
| fc3d | 福彩3D | 每日 | 3个 |
| ssq | 双色球 | 二四日 | 7个 |
| qlc | 七乐彩 | 一三五 | 8个 |

---

## 错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 1001 | Token无效 | 检查API密钥是否正确 |
| 1002 | Token已过期 | 续费或重新获取Token |
| 1003 | 彩种不存在 | 检查彩种代码是否正确 |
| 1004 | 超出调用限制 | 降低请求频率 |
| 1005 | 日期格式错误 | 使用YYYYMMDD格式 |
| 1006 | 暂无数据 | 该时间段无开奖数据 |

详见: [错误码详解](./error-codes.md)

---

## 示例代码

### JavaScript/jQuery调用

```javascript
// 获取最新开奖数据
$.getJSON('http://api.byw.bet:868/api', {
    token: 'YOUR_TOKEN',
    t: 'cqssc',
    limit: 5,
    p: 'jsonp',
    callback: '?'
}, function(data) {
    console.log(data);
});
```

### PHP调用

```php
$client = new BywClient('YOUR_TOKEN');
$result = $client->getLatest('cqssc');
echo $result['Opencode'];
```

### C#调用

```csharp
var client = new BywClient("YOUR_TOKEN");
var result = await client.GetLatestAsync("cqssc");
Console.WriteLine(result.Opencode);
```

更多示例: [SDK使用指南](./sdk-guide.md)

---

## 相关链接

- 🌐 官网: https://www.byw.bet
- 📖 API文档: https://www.byw.bet/docs/show.html
- 💻 GitHub: https://github.com/your-repo/byw-lottery-api-sdk
- ❓ 常见问题: [FAQ](./faq.md)

---

**关键词**: 彩票API接口 | 实时开奖数据API | 彩票数据SDK | 开奖数据接口平台 | 重庆时时彩API | 广东11选5API
