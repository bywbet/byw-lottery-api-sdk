# jQuery XML 彩票数据采集示例

本目录包含 **jQuery** 彩票开奖数据 API 的 XML 格式采集示例，使用代理方式解决跨域问题。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [JavaScript SDK 文档](../../src/javascript/index.js)
- [jQuery JSON 示例](../jquery-json-demo/)
- [proxy.php 代理说明](#proxy代理说明)

## 🎯 功能特性

- **jQuery XML 解析** - 使用 jQuery 解析 XML 数据
- **代理转发** - 通过 proxy.php 解决跨域问题
- **实时展示** - 实时显示开奖数据
- **多彩种支持** - 支持 109 个彩票品种
- **自动刷新** - 可配置自动刷新频率

## 🚀 快速开始

### 1. 环境要求

- PHP Web 服务器（用于代理）
- jQuery 1.x+
- 现代浏览器

### 2. 部署步骤

1. 将整个目录部署到 PHP Web 服务器
2. 修改 `jquery4xml.htm` 中的 API 地址
3. 修改 `proxy.php` 中的目标地址
4. 通过浏览器访问 `jquery4xml.htm`

### 3. API 地址配置

```javascript
// 在 jquery4xml.htm 中
$.ajax({
    url: 'proxy.php?src=http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=10&p=xml',
    dataType: 'xml'
});
```

```php
# 在 proxy.php 中
$src = 'http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=10&p=xml';
```

### 4. 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| src | 目标API地址（URL编码） | proxy.php?src=编码后的URL |
| token | API Token | 您的API令牌 |
| t | 彩种ID (lotteryid) | 4 (重庆时时彩) |
| limit | 返回数量 | 10 |
| p | 返回格式 | xml |

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

### jQuery XML 解析

```javascript
$(document).ready(function(){
    $.ajax({
        url: 'proxy.php?src=http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=10&p=xml',
        dataType: 'xml',
        type: 'POST',
        timeout: 5000,
        success: function(result){
            // 获取总行数
            var totalRows = $(result).find("xml").attr("row");
            $("#okay").append("共采集到 " + totalRows + " 行开奖数据：<br>");

            // 遍历每一行数据
            $(result).find("row").each(function(){
                var p = $(this).attr("expect");
                $("#okay").append('<br>开奖期号：' + p.substr(0,8) + '-' + p.substr(-3,3));
                $("#okay").append('<br>开奖号码：' + $(this).attr("opencode"));
                $("#okay").append('<br>开奖时间：' + $(this).attr("opentime"));
                $("#okay").append('<br>');
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  
            alert("加载彩票数据出错! 错误信息：" + textStatus);
        }
    });
});
```

### XML 数据结构

```xml
<?xml version="1.0" encoding="utf-8"?>
<xml row="5">
    <row expect="20260418001" opencode="1,2,3,4,5" opentime="2026-04-18 09:00:00"/>
    <row expect="20260417059" opencode="2,3,4,5,6" opentime="2026-04-17 22:00:00"/>
    <!-- 更多数据... -->
</xml>
```

### Proxy 代理说明

由于浏览器同源策略限制，前端 JavaScript 无法直接请求不同域的 XML 接口。需要通过服务端代理中转：

```php
<?php
// proxy.php
header('Content-Type: text/xml; charset=utf-8');
$src = isset($_GET['src']) ? $_GET['src'] : '';
if ($src) {
    echo file_get_contents($src);
}
?>
```

## 🔧 项目结构

```
jquery-xml-demo/
├── jquery4xml.htm     # XML采集示例主页面
├── proxy.php          # PHP代理文件
└── README.md          # 本文件
```

## ⚠️ 注意事项

1. **跨域问题** - XML 格式不支持 JSONP，需要通过代理解决
2. **Token 安全** - 代理 PHP 文件中的 Token 需妥善保管
3. **代理缓存** - 生产环境建议添加缓存机制
4. **错误处理** - XML 解析失败时的错误处理

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- jQuery 官网: https://jquery.com
- JavaScript SDK: [index.js](../../src/javascript/index.js)

---

## SEO 关键词

jQuery XML解析, 前端XML采集, 代理中转, JavaScript彩票接口, XML跨域请求, jQuery AJAX, PHP代理, 前端开发, 博彩API集成, XML数据解析, 时时彩接口, 11选5接口, 网页数据抓取, 同源策略, CORS跨域
