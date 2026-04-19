# jQuery JSON(P) 彩票数据采集示例

本目录包含 **jQuery** 彩票开奖数据 API 的 JSON(P) 格式采集示例，纯前端实现，无需服务器端支持。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [JavaScript SDK 文档](../../src/javascript/index.js)
- [jQuery XML 示例](../jquery-xml-demo/)

## 🎯 功能特性

- **纯前端实现** - 无需后端服务器
- **JSONP 跨域** - 支持跨域数据请求
- **实时刷新** - 自动获取最新开奖数据
- **多彩种支持** - 支持 109 个彩票品种
- **jQuery CDN** - 使用 jQuery CDN 自动加载

## 🚀 快速开始

### 1. 环境要求

- 现代浏览器（Chrome、Firefox、Edge、Safari）
- jQuery 1.x+
- Web 服务器或本地文件访问

### 2. 使用方法

#### 方式一：直接打开 HTML 文件

1. 用浏览器直接打开 `jquery4json.htm` 文件
2. 修改文件中的 API 地址为有效的地址
3. 刷新页面查看效果

#### 方式二：通过 Web 服务器

1. 将文件部署到 Web 服务器
2. 访问 `http://your-server/jquery4json.htm`
3. 确保 API 支持 JSONP 跨域

### 3. API 地址配置

```javascript
$.ajax({
    url: 'http://api.byw.bet:868/api?token=您的TOKEN&t=4&limit=10&p=json',
    dataType: 'jsonp',
    jsonpCallback: 'jsonpReturn'
});
```

### 4. 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| token | API Token | 您的API令牌 |
| t | 彩种ID (lotteryid) | 4 (重庆时时彩) |
| limit | 返回数量 | 10 |
| p | 返回格式 | json |

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

### jQuery JSONP 请求

```javascript
$(document).ready(function(){
    $.ajax({
        url: 'http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=10&p=json',
        dataType: 'jsonp',
        type: 'POST',
        timeout: 5000,
        cache: false,
        jsonp: false,
        jsonpCallback: 'jsonpReturn',
        success: function(result){
            $("#okay").append("<br>共采集到 " + result.Rows + " 行开奖数据：<br>");
            
            for (var i = 0; i < result.Data.length; i++) {
                var p = result.Data[i].Expect;
                $("#okay").append('<br>开奖期号：' + p.substr(0,8) + '-' + p.substr(-3,3));
                $("#okay").append('<br>开奖号码：' + result.Data[i].Opencode);
                $("#okay").append('<br>开奖时间：' + result.Data[i].Opentime);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  
            alert("加载彩票数据出错!");
        }
    });
});
```

### 数据字段说明

| 字段 | 说明 |
|------|------|
| Rows | 返回数据总行数 |
| Data | 开奖数据数组 |
| Data[i].Expect | 开奖期号 |
| Data[i].Opencode | 开奖号码 |
| Data[i].Opentime | 开奖时间 |

## 🔧 项目结构

```
jquery-json-demo/
├── jquery4json.htm     # JSON(P)采集示例
└── README.md           # 本文件
```

## ⚠️ 注意事项

1. **跨域限制** - JSONP 需要 API 支持，请确保接口支持 JSONP 返回
2. **Token 安全** - 前端代码中的 Token 可能被暴露
3. **错误处理** - 建议添加超时处理和错误提示
4. **CORS 方案** - 如 API 支持 CORS，可改用 JSON 格式

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/docs/show.html
- jQuery 官网: https://jquery.com
- JavaScript SDK: [index.js](../../src/javascript/index.js)

---

## SEO 关键词

jQuery JSONP, 前端数据采集, 跨域请求, JavaScript彩票接口, JSONP跨域, jQuery AJAX, 前端开发, 博彩API集成, JSON数据解析, 时时彩接口, 11选5接口, 快三接口, 网页数据抓取, 浏览器端开发, 前端实时数据
