# 移动端 XML 彩票数据接口指南

本目录包含 **移动端应用** 彩票开奖数据 API 的 XML 格式接入指南。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [移动端 JSON 接口指南](../mobile-json-demo/)

## 🎯 移动端 XML 支持

对于需要 XML 格式响应的移动端应用，以下是各平台的集成方案：

| 平台 | 推荐库 | 说明 |
|------|--------|------|
| Android | XmlPullParser | 内置 XML 解析 |
| iOS | XMLParser | 内置 XML 解析 |
| React Native | react-native-xml-parser | 第三方库 |
| Flutter | xml | pub.dev 库 |

## 📱 常用彩种 API

### 基础格式

```bash
# HTTP GET 请求
GET http://api.byw.bet:868/api?token=您的TOKEN&t=彩种ID&limit=数量&p=xml
```

### 常用 API 地址

| 彩种 | lotteryid | API 示例 |
|------|-----------|----------|
| 重庆时时彩 | 4 | `http://api.byw.bet:868/api?token=TOKEN&t=4&limit=10&p=xml` |
| 广东11选5 | 59 | `http://api.byw.bet:868/api?token=TOKEN&t=59&limit=10&p=xml` |
| 北京赛车 | 8 | `http://api.byw.bet:868/api?token=TOKEN&t=8&limit=10&p=xml` |
| 江苏快三 | 78 | `http://api.byw.bet:868/api?token=TOKEN&t=78&limit=10&p=xml` |

## 🔧 移动端集成示例

### Android (Kotlin + OkHttp + XmlPullParser)

```kotlin
import okhttp3.OkHttpClient
import okhttp3.Request
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory
import java.io.StringReader
import java.util.concurrent.TimeUnit

data class LotteryResult(
    val expect: String,
    val opencode: String,
    val opentime: String
)

class LotteryXmlService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    fun parseLotteryXml(xmlContent: String): List<LotteryResult> {
        val results = mutableListOf<LotteryResult>()
        
        val factory = XmlPullParserFactory.newInstance()
        val parser = factory.newPullParser()
        parser.setInput(StringReader(xmlContent))
        
        var eventType = parser.eventType
        var currentResult: LotteryResult? = null
        var currentTag = ""
        
        while (eventType != XmlPullParser.END_DOCUMENT) {
            when (eventType) {
                XmlPullParser.START_TAG -> {
                    currentTag = parser.name
                    if (currentTag == "row") {
                        val expect = parser.getAttributeValue(null, "expect") ?: ""
                        val opencode = parser.getAttributeValue(null, "opencode") ?: ""
                        val opentime = parser.getAttributeValue(null, "opentime") ?: ""
                        currentResult = LotteryResult(expect, opencode, opentime)
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (parser.name == "row" && currentResult != null) {
                        results.add(currentResult!!)
                    }
                    currentTag = ""
                }
            }
            eventType = parser.next()
        }
        
        return results
    }

    fun fetchLotteryData(lotteryId: String, limit: Int = 10): List<LotteryResult>? {
        val url = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=$lotteryId&limit=$limit&p=xml"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .build()

        return try {
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string()
                body?.let { parseLotteryXml(it) }
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}

// 使用示例
val service = LotteryXmlService()
val results = service.fetchLotteryData("4", 10) // 重庆时时彩
results?.forEach { result ->
    println("期号: ${result.expect}")
    println("号码: ${result.opencode}")
    println("时间: ${result.opentime}")
}
```

### iOS (Swift + XMLParser)

```swift
import Foundation

struct LotteryResult {
    let expect: String
    let opencode: String
    let opentime: String
}

class XMLLotteryParser: NSObject, XMLParserDelegate {
    var results: [LotteryResult] = []
    var currentElement = ""
    var currentExpect = ""
    var currentOpencode = ""
    var currentOpentime = ""
    
    func parse(xmlData: Data) -> [LotteryResult] {
        let parser = XMLParser(data: xmlData)
        parser.delegate = self
        parser.parse()
        return results
    }
    
    // MARK: - XMLParserDelegate
    
    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        currentElement = elementName
        
        if elementName == "row" {
            currentExpect = attributeDict["expect"] ?? ""
            currentOpencode = attributeDict["opencode"] ?? ""
            currentOpentime = attributeDict["opentime"] ?? ""
        }
    }
    
    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        if elementName == "row" {
            let result = LotteryResult(
                expect: currentExpect,
                opencode: currentOpencode,
                opentime: currentOpentime
            )
            results.append(result)
        }
        currentElement = ""
    }
}

class LotteryXMLService {
    static let shared = LotteryXMLService()
    private let session = URLSession.shared
    private let parser = XMLLotteryParser()
    
    func fetchLotteryData(lotteryId: String, limit: Int = 10, completion: @escaping (Result<[LotteryResult], Error>) -> Void) {
        let urlString = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=\(lotteryId)&limit=\(limit)&p=xml"
        
        guard let url = URL(string: urlString) else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }
        
        let task = session.dataTask(with: url) { [weak self] data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: 0)))
                return
            }
            
            if let results = self?.parser.parse(xmlData: data) {
                completion(.success(results))
            } else {
                completion(.failure(NSError(domain: "Parse error", code: 0)))
            }
        }
        
        task.resume()
    }
}

// 使用示例
LotteryXMLService.shared.fetchLotteryData(lotteryId: "4", limit: 10) { result in
    switch result {
    case .success(let results):
        for item in results {
            print("期号: \(item.expect)")
            print("号码: \(item.opencode)")
            print("时间: \(item.opentime)")
        }
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### Flutter (Dart + xml)

```dart
import 'package:http/http.dart' as http;
import 'package:xml/xml.dart';

class LotteryResult {
  final String expect;
  final String opencode;
  final String opentime;

  LotteryResult({
    required this.expect,
    required this.opencode,
    required this.opentime,
  });
}

class LotteryXmlService {
  final String baseUrl = 'http://api.byw.bet:868/api';
  final String token = 'YOUR_TOKEN';

  Future<List<LotteryResult>> fetchLotteryData(String lotteryId, {int limit = 10}) async {
    final url = '$baseUrl?token=$token&t=$lotteryId&limit=$limit&p=xml';
    
    try {
      final response = await http.get(Uri.parse(url));
      
      if (response.statusCode == 200) {
        return parseXmlData(response.body);
      } else {
        throw Exception('请求失败: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('网络错误: $e');
    }
  }

  List<LotteryResult> parseXmlData(String xmlString) {
    final document = XmlDocument.parse(xmlString);
    final results = <LotteryResult>[];
    
    final rows = document.findAllElements('row');
    
    for (final row in rows) {
      results.add(LotteryResult(
        expect: row.getAttribute('expect') ?? '',
        opencode: row.getAttribute('opencode') ?? '',
        opentime: row.getAttribute('opentime') ?? '',
      ));
    }
    
    return results;
  }
}

// 使用示例
void main() async {
  final service = LotteryXmlService();
  
  try {
    final results = await service.fetchLotteryData('4', limit: 10);
    
    for (final result in results) {
      print('期号: ${result.expect}');
      print('号码: ${result.opencode}');
      print('时间: ${result.opentime}');
      print('---');
    }
  } catch (e) {
    print('错误: $e');
  }
}
```

## 📊 彩种代码参考

> 使用数据库 `lotteryid` 作为彩种代码

| 彩种 | lotteryid | 类型 |
|------|-----------|------|
| 重庆时时彩 | 4 | 时时彩 |
| 新疆时时彩 | 5 | 时时彩 |
| 黑龙江时时彩 | 1 | 时时彩 |
| 天津时时彩 | 3 | 时时彩 |
| 广东11选5 | 59 | 11选5 |
| 山东11选5 | 60 | 11选5 |
| 江苏快三 | 78 | 快三 |
| 安徽快三 | 85 | 快三 |
| 北京赛车(PK10) | 8 | PK10 |
| 幸运飞艇 | 112 | PK10 |
| 澳洲幸运10 | 115 | 幸运系列 |
| 台湾賓果 | 117 | 宾果 |
| 福彩3D | 21 | 数字彩 |
| 双色球 | 22 | 数字彩 |
| 大乐透 | 24 | 数字彩 |

> 完整彩种列表请参考 [主README](../../README.md#-支持的彩种)

## 📝 XML 响应格式

```xml
<?xml version="1.0" encoding="utf-8"?>
<xml row="5">
    <row expect="20260418001" opencode="1,2,3,4,5" opentime="2026-04-18 09:00:00"/>
    <row expect="20260417059" opencode="2,3,4,5,6" opentime="2026-04-17 22:00:00"/>
    <row expect="20260417058" opencode="3,4,5,6,7" opentime="2026-04-17 21:40:00"/>
    <row expect="20260417057" opencode="4,5,6,7,8" opentime="2026-04-17 21:20:00"/>
    <row expect="20260417056" opencode="5,6,7,8,9" opentime="2026-04-17 21:00:00"/>
</xml>
```

### XML 字段说明

| 属性 | 说明 |
|------|------|
| expect | 开奖期号 |
| opencode | 开奖号码 |
| opentime | 开奖时间 |

### 根节点属性

| 属性 | 说明 |
|------|------|
| row | 返回数据总行数 |

## 🔧 项目结构

```
mobile-xml-demo/
├── LotteryApiKotlinXml.kt      # Android/Kotlin XML 完整示例
├── LotteryApiSwiftXml.swift      # iOS/Swift XML 完整示例
├── LotteryApiFlutterXml.dart     # Flutter/Dart XML 完整示例
└── README.md                    # 本文件
```

### 快速开始

1. **Android/Kotlin** - 将 `LotteryApiKotlinXml.kt` 复制到项目中
2. **iOS/Swift** - 将 `LotteryApiSwiftXml.swift` 复制到项目中
3. **Flutter** - 将 `LotteryApiFlutterXml.dart` 复制到项目中

### 依赖配置

**Android (build.gradle)**
```groovy
dependencies {
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
}
```

**Flutter (pubspec.yaml)**
```yaml
dependencies:
  http: ^1.1.0
  xml: ^6.3.0
```

## ⚠️ 注意事项

1. **XML 解析** - 各平台 XML 解析方式不同
2. **编码处理** - 确保使用 UTF-8 编码
3. **异常处理** - 网络和解析异常需处理
4. **数据验证** - XML 属性可能为空
5. **安全考虑** - Token 存储在服务端更安全

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- Android XML 解析: https://developer.android.com/reference/org/xmlpull/v1/XmlPullParser
- iOS XML 解析: https://developer.apple.com/documentation/foundation/xmlparser
- Flutter XML: https://pub.dev/packages/xml

---

## SEO 关键词

移动端XML, Android XML解析, iOS XML解析, Flutter XML, React Native XML, XmlPullParser, XMLParser, 移动端开发, 彩票接口, XML数据解析, 跨平台开发, App开发, 手机APP, XML解析库, 移动端数据采集
