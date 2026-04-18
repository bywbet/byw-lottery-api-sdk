# 移动端 JSON 彩票数据接口指南

本目录包含 **移动端应用** 彩票开奖数据 API 的 JSON 格式接入指南。

## 📚 相关文档

- [SDK使用指南](../../docs/sdk-guide.md)
- [API接口文档](../../docs/api-reference.md)
- [JavaScript SDK 文档](../../src/javascript/index.js)
- [移动端 XML 接口指南](../mobile-xml-demo/)

## 🎯 移动端支持

我们的 SDK 支持多种移动端开发框架：

| 框架/平台 | 推荐方案 | 说明 |
|-----------|----------|------|
| React Native | JavaScript SDK | 可直接集成使用 |
| Flutter | HTTP API | 使用 http package 调用 |
| uni-app | JavaScript SDK | 原生支持 |
| WeChat Mini | JavaScript SDK | 小程序适配 |
| Android (Kotlin) | HTTP API | OkHttp 调用 |
| iOS (Swift) | HTTP API | URLSession 调用 |

## 📱 常用彩种 API

### 基础格式

```bash
# HTTP GET 请求
GET http://api.byw.bet:868/api?token=您的TOKEN&t=彩种ID&limit=数量&p=json
```

### 常用 API 地址

| 彩种 | lotteryid | API 示例 |
|------|-----------|----------|
| 重庆时时彩 | 4 | `http://api.byw.bet:868/api?token=TOKEN&t=4&limit=10&p=json` |
| 广东11选5 | 59 | `http://api.byw.bet:868/api?token=TOKEN&t=59&limit=10&p=json` |
| 北京赛车 | 8 | `http://api.byw.bet:868/api?token=TOKEN&t=8&limit=10&p=json` |
| 江苏快三 | 78 | `http://api.byw.bet:868/api?token=TOKEN&t=78&limit=10&p=json` |

## 🔧 移动端集成示例

### Android (Kotlin + OkHttp)

```kotlin
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class LotteryApiService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    fun getLotteryData(lotteryId: String, limit: Int = 10): JSONObject? {
        val url = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=$lotteryId&limit=$limit&p=json"
        
        val request = Request.Builder()
            .url(url)
            .get()
            .build()

        return try {
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string()
                body?.let { JSONObject(it) }
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}

// 使用示例
val api = LotteryApiService()
val result = api.getLotteryData("4", 10) // 重庆时时彩
val rows = result?.getInt("Rows")
val data = result?.getJSONArray("Data")
```

### iOS (Swift + URLSession)

```swift
import Foundation

class LotteryAPIService {
    static let shared = LotteryAPIService()
    private let session = URLSession.shared
    
    func fetchLotteryData(lotteryId: String, limit: Int = 10, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        let urlString = "http://api.byw.bet:868/api?token=YOUR_TOKEN&t=\(lotteryId)&limit=\(limit)&p=json"
        
        guard let url = URL(string: urlString) else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }
        
        let task = session.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: 0)))
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    completion(.success(json))
                }
            } catch {
                completion(.failure(error))
            }
        }
        
        task.resume()
    }
}

// 使用示例
LotteryAPIService.shared.fetchLotteryData(lotteryId: "4", limit: 10) { result in
    switch result {
    case .success(let data):
        print("Rows: \(data["Rows"] ?? 0)")
        if let lotteryData = data["Data"] as? [[String: Any]] {
            for item in lotteryData {
                print("期号: \(item["Expect"] ?? "")")
                print("号码: \(item["Opencode"] ?? "")")
            }
        }
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### React Native

```javascript
import { useState, useEffect } from 'react';

const LOTTERY_API = 'http://api.byw.bet:868/api';
const TOKEN = 'YOUR_TOKEN';

export const useLotteryData = (lotteryId, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${LOTTERY_API}?token=${TOKEN}&t=${lotteryId}&limit=${limit}&p=json`
        );
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lotteryId, limit]);

  return { data, loading, error };
};

// 组件中使用
const LotteryScreen = () => {
  const { data, loading, error } = useLotteryData('4', 10); // 重庆时时彩

  if (loading) return <Text>加载中...</Text>;
  if (error) return <Text>错误: {error.message}</Text>;

  return (
    <View>
      <Text>共 {data.Rows} 条数据</Text>
      {data.Data.map((item, index) => (
        <View key={index}>
          <Text>期号: {item.Expect}</Text>
          <Text>号码: {item.Opencode}</Text>
        </View>
      ))}
    </View>
  );
};
```

### uni-app (Vue)

```javascript
// utils/lotteryApi.js
const LOTTERY_API = 'http://api.byw.bet:868/api';
const TOKEN = 'YOUR_TOKEN';

export const getLotteryData = (lotteryId, limit = 10) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: LOTTERY_API,
      data: {
        token: TOKEN,
        t: lotteryId,
        limit: limit,
        p: 'json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// 页面中使用
import { getLotteryData } from '@/utils/lotteryApi.js';

export default {
  data() {
    return {
      lotteryList: [],
      loading: false
    };
  },
  onLoad() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await getLotteryData('4', 10); // 重庆时时彩
        this.lotteryList = res.Data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
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

## 📝 JSON 响应格式

```json
{
  "Rows": 10,
  "Data": [
    {
      "Expect": "20260418001",
      "Opencode": "1,2,3,4,5",
      "Opentime": "2026-04-18 09:00:00"
    },
    {
      "Expect": "20260417059",
      "Opencode": "2,3,4,5,6",
      "Opentime": "2026-04-17 22:00:00"
    }
  ]
}
```

## 🔧 项目结构

```
mobile-json-demo/
├── LotteryApiKotlin.kt         # Android/Kotlin 完整示例
├── LotteryApiSwift.swift        # iOS/Swift 完整示例
├── LotteryApiReactNative.jsx    # React Native 完整示例
├── LotteryApiFlutter.dart       # Flutter/Dart 完整示例
└── README.md                    # 本文件
```

### 快速开始

1. **Android/Kotlin** - 将 `LotteryApiKotlin.kt` 复制到项目中
2. **iOS/Swift** - 将 `LotteryApiSwift.swift` 复制到项目中
3. **React Native** - 将 `LotteryApiReactNative.jsx` 复制到项目中
4. **Flutter** - 将 `LotteryApiFlutter.dart` 复制到项目中

### 依赖配置

**Android (build.gradle)**
```groovy
dependencies {
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

**Flutter (pubspec.yaml)**
```yaml
dependencies:
  http: ^1.1.0
```

## ⚠️ 注意事项

1. **HTTPS** - 生产环境建议使用 HTTPS
2. **Token 安全** - Token 建议存储在服务端
3. **网络状态** - 移动端需处理网络异常
4. **数据缓存** - 建议本地缓存减少请求
5. **接口限流** - 注意接口调用频率限制

## 🔗 相关链接

- 官方文档: https://www.byw.bet
- API文档: https://www.byw.bet/show.html
- JavaScript SDK: [index.js](../../src/javascript/index.js)

---

## SEO 关键词

移动端开发, React Native, Flutter, Android开发, iOS开发, Swift开发, Kotlin, uni-app, 微信小程序, 移动端API, 彩票接口移动端, 跨平台开发, 手机APP, 移动端数据采集, App开发框架
