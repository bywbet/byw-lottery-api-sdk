# C# WinForms 彩票API调用示例 (XML)

本目录包含 **C# WinForms 桌面应用** 彩票开奖数据API的完整调用示例，支持 XML 格式数据解析。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [错误码说明](../../docs/error-codes.md)

## 🎯 功能特性

- **WinForms 桌面应用** - 原生 Windows 桌面程序
- **XML 格式解析** - 使用 XmlDocument 解析 XML 数据
- **实时开奖查询** - 支持查询最新开奖结果
- **多彩种支持** - 支持 109 个彩票品种
- **批量数据展示** - 显示多期开奖历史

## 🚀 快速开始

### 1. 环境要求

- .NET Framework 3.5+
- Visual Studio 2010 或更高版本

### 2. 编译运行

1. 使用 Visual Studio 打开 `OCAPIDemo.csproj` 项目文件
2. 确保项目引用了 LitJson.dll（如未引用，请添加）
3. 按 F5 或点击 "启动" 按钮编译运行

### 3. API 地址配置

在程序的输入框中填入 API 地址，格式如下：

```
http://api.byw.bet:868/api?token=您的TOKEN&t=彩种ID&limit=数量&p=xml
```

### 4. 示例地址

```bash
# 重庆时时彩最新5期数据 (lotteryid: 4)
http://api.byw.bet:868/api?token=YOUR_TOKEN&t=4&limit=5&p=xml

# 广东11选5最新5期数据 (lotteryid: 59)
http://api.byw.bet:868/api?token=YOUR_TOKEN&t=59&limit=5&p=xml

# 北京赛车最新5期数据 (lotteryid: 8)
http://api.byw.bet:868/api?token=YOUR_TOKEN&t=8&limit=5&p=xml
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
| 排列三 | 25 |
| 排列五 | 26 |

> 完整彩种列表请参考 [主README](../../README.md#-支持的彩种)

## 🔧 项目结构

```
csharp-xml-winforms/
├── OCAPIDemo.csproj      # 项目文件
├── Program.cs             # 程序入口
├── FormDemo.cs           # 主窗体逻辑
├── FormDemo.Designer.cs # 窗体设计器
├── FormDemo.resx         # 窗体资源
├── api.opencai.net.cs    # HTTP请求封装类
└── Properties/           # 项目属性
    ├── AssemblyInfo.cs
    ├── Resources.resx
    ├── Resources.Designer.cs
    ├── Settings.settings
    └── Settings.Designer.cs
```

## 📝 核心代码说明

### XML 数据解析

```csharp
// 使用 XmlDocument 解析 XML 响应
XmlDocument xml = new XmlDocument();
xml.LoadXml(html);

// 获取数据行数
int rowCount = int.Parse(xml.SelectSingleNode("xml").Attributes["row"].Value);

// 遍历开奖数据
foreach (XmlNode node in xml.SelectNodes("xml/row"))
{
    string expect = node.Attributes["expect"].Value;
    string opencode = node.Attributes["opencode"].Value;
    string opentime = node.Attributes["opentime"].Value;
    
    Console.WriteLine($"开奖期号：{expect}");
    Console.WriteLine($"开奖号码：{opencode}");
    Console.WriteLine($"开奖时间：{opentime}");
}
```

### HTTP 请求封装

```csharp
public static string HttpGet(string url, Encoding enc)
{
    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
    request.Timeout = 10000; // 10秒超时
    request.Proxy = null;
    request.Method = "GET";
    
    WebResponse response = request.GetResponse();
    StreamReader reader = new StreamReader(response.GetResponseStream(), enc);
    return reader.ReadToEnd();
}
```

## ⚠️ 注意事项

1. **Token 安全** - 请勿在代码中暴露 API Token
2. **网络超时** - 默认 10 秒超时，可根据需要调整
3. **编码格式** - 使用 UTF-8 编码解析中文
4. **错误处理** - 请做好异常捕获和数据校验

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/docs/show.html
- GitHub: https://github.com/your-repo/byw-lottery-api-sdk

---

## SEO 关键词

彩票API接口, XML数据解析, C# WinForms, XML格式接口, 桌面应用开发, 彩票XML接口, .NET XML解析, XmlDocument使用, WinForm桌面程序, 彩票开奖XML, C# HTTP请求, 数据采集接口, .NET桌面应用, 博彩API集成
