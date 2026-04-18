# ASP 彩票 XML 数据采集示例

本目录包含 **ASP (Classic ASP)** 彩票开奖数据 API 的 XML 格式采集示例，适用于 Windows IIS 服务器。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [C# WinForms XML 示例](../csharp-xml-winforms/)
- [PHP XML 示例](../php-xml-demo/)

## 🎯 功能特性

- **Classic ASP** - 传统 ASP 脚本语言
- **XML 解析** - 使用 Microsoft.XMLDOM 解析
- **ServerXMLHTTP** - 服务端 HTTP 请求
- **Windows IIS** - 适用于 IIS 服务器环境
- **多彩种支持** - 支持 109 个彩票品种

## 🚀 快速开始

### 1. 环境要求

- Windows Server / IIS
- ASP (Classic ASP) 支持
- Microsoft XML Core Services (MSXML)

### 2. 部署步骤

1. 确保 IIS 已启用 ASP 功能
2. 将 `asp-xml.asp` 部署到 IIS 网站目录
3. 修改代码中的 API 地址
4. 通过浏览器访问 `http://your-server/asp-xml.asp`

### 3. API 地址配置

```asp
<%
dim url
url = "http://api.byw.bet:868/api?token=您的TOKEN&t=4&limit=10&p=xml"
%>
```

### 4. 示例 API 地址

```asp
<%
' 重庆时时彩
url = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=10&p=xml"

' 广东11选5
url = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=59&limit=10&p=xml"

' 北京赛车
url = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=8&limit=10&p=xml"
%>
```

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

### XML HTTP 请求

```asp
<%
' 创建 HTTP 请求对象
set xml = Server.CreateObject("Microsoft.XMLHTTP")
xml.Open "GET", url & "?&" & rnd(), False
xml.Send

' 创建 XML DOM 对象
set xmlDom = server.createObject("microsoft.xmldom")
xmlDom.async = False
xmlDom.ValidateOnParse = False
xmlDom.load(xml.responseXML)
%>
```

### 解析 XML 数据

```asp
<%
if xmlDom.ReadyState > 2 Then 
    ' 获取所有行节点
    set rows = xmlDom.documentElement.SelectSingleNode("//xml").ChildNodes
    
    response.write("<br>共采集到 " & rows.length & " 行开奖数据：<br>")
    
    for i = 0 to rows.length - 1
        response.write("<br>开奖期号：" & rows(i).attributes(0).Value)
        response.write("<br>开奖号码：" & rows(i).attributes(1).Value)
        response.write("<br>开奖时间：" & rows(i).attributes(2).Value)
        response.write("<br>")
    next
end if
%>
```

### XML 响应格式

```xml
<?xml version="1.0" encoding="utf-8"?>
<xml row="5">
    <row expect="20260418001" opencode="1,2,3,4,5" opentime="2026-04-18 09:00:00"/>
    <row expect="20260417059" opencode="2,3,4,5,6" opentime="2026-04-17 22:00:00"/>
</xml>
```

### 字段说明

| 节点属性 | 说明 |
|----------|------|
| expect | 开奖期号 |
| opencode | 开奖号码 |
| opentime | 开奖时间 |

## 🔧 项目结构

```
asp-demo/
├── asp-xml.asp         # ASP采集示例
└── README.md           # 本文件
```

## ⚠️ 注意事项

1. **IIS 配置** - 确保 IIS 启用 ASP 支持
2. **权限问题** - 确保 IIS 进程有网络访问权限
3. **超时处理** - 添加请求超时处理
4. **错误处理** - 添加 XML 解析错误处理
5. **编码设置** - 页面需设置 UTF-8 编码

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- IIS ASP 配置: https://docs.microsoft.com/en-us/iis/application-frameworks/running-classic-asp-applications

---

## SEO 关键词

ASP XML解析, Classic ASP, Windows IIS, ASP数据采集, XML接口, 彩票API, ASP HTTP请求, Microsoft.XMLHTTP, ServerXMLHTTP, IIS服务器, 博彩API集成, XML数据解析, ASP开发, VBScript, Windows服务器
