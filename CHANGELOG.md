# Changelog

所有重要的项目更新都会记录在此文件中。

## [1.0.0] - 2026-04-18

### 🎉 首次发布

- ✅ 发布官方多语言SDK（C# / PHP / JavaScript）
- ✅ 提供完整的API接口文档
- ✅ 发布SDK使用指南
- ✅ 提供Postman调试集合
- ✅ 提供cURL调用示例
- ✅ 创建Web在线演示页面
- ✅ 添加完整的错误码说明
- ✅ 编写常见问题FAQ

### SDK功能

#### C# SDK v1.0.0
- ✅ BywClient客户端封装
- ✅ GetLatestAsync() - 获取最新开奖
- ✅ GetLatestMultiAsync() - 获取多期数据
- ✅ GetHistoryByDateAsync() - 指定日期查询
- ✅ GetHistoryAsync() - 历史记录查询
- ✅ GetSupportedLotteries() - 彩种列表

#### PHP SDK v1.0.0
- ✅ BywClient客户端封装
- ✅ getLatest() - 获取最新开奖
- ✅ getLatestMulti() - 获取多期数据
- ✅ getByDate() - 指定日期查询
- ✅ getHistory() - 历史记录查询
- ✅ requestWithCurl() - cURL请求
- ✅ getSupportedLotteries() - 彩种列表

#### JavaScript SDK v1.0.0
- ✅ BywClient客户端封装
- ✅ latest() - 获取最新开奖
- ✅ latestMulti() - 获取多期数据
- ✅ byDate() - 指定日期查询
- ✅ history() - 历史记录查询
- ✅ nextDrawTime() - 获取下期时间
- ✅ SUPPORTED_LOTTERIES - 彩种列表

### 文档更新

- 📘 docs/index.md - API总览文档
- 📘 docs/api-reference.md - 完整接口参考
- 📘 docs/sdk-guide.md - SDK使用指南
- 📘 docs/error-codes.md - 错误码详解
- 📘 docs/faq.md - 常见问题

### 示例代码

- 💻 samples/csharp-demo/ - C#调用示例
- 💻 samples/php-demo/ - PHP调用示例
- 💻 samples/js-demo/ - JavaScript调用示例
- 💻 samples/web-demo/ - Web在线演示

### 开发工具

- 🔧 tools/postman-collection.json - Postman集合
- 🔧 tools/curl-examples.sh - cURL示例脚本

### 官网镜像

- 🌐 website/index.html - 官网首页
- 🌐 website/api.html - API文档页
- 🌐 website/sdk.html - SDK下载页

---

## 待办功能

- [ ] NPM包发布
- [ ] NuGet包发布
- [ ] Composer包发布
- [ ] Python SDK开发
- [ ] Go SDK开发
- [ ] Ruby SDK开发
- [ ] Webhook实时推送支持
- [ ] 数据统计面板
