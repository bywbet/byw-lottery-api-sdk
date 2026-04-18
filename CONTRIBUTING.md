# Contributing to Byw Lottery API SDK

感谢您对 byw-lottery-api-sdk 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 1. 报告问题

如果您发现bug或有功能建议，请：

1. 在 GitHub Issues 中创建新问题
2. 使用问题模板（如果可用）
3. 提供详细的复现步骤

### 2. 提交代码

#### 开发流程

1. **Fork 本仓库**
2. **创建特性分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行开发**
   ```bash
   # 开发你的功能
   git add .
   git commit -m "Add: your feature description"
   ```

4. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**

#### Pull Request 指南

- 使用清晰的标题描述您的更改
- 详细描述您所做的更改及原因
- 确保所有测试通过
- 更新相关文档

### 3. 代码规范

#### C# 代码规范

- 遵循 [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- 使用有意义的变量和方法名
- 添加必要的注释
- 确保代码通过静态分析

#### PHP 代码规范

- 遵循 [PSR-12](https://www.php-fig.org/psr/psr-12/) 标准
- 使用有意义的变量和方法名
- 做好异常处理

#### JavaScript 代码规范

- 遵循 ES6+ 标准
- 使用有意义的变量和方法名
- 添加JSDoc注释

### 4. 新增SDK语言

如果您想添加新的语言SDK，请：

1. 在 `src/` 目录下创建新的语言文件夹
2. 实现核心功能：
   - 客户端初始化
   - 获取最新开奖
   - 获取多期数据
   - 历史数据查询
3. 在 `samples/` 添加示例代码
4. 更新本文档

### 5. 完善文档

我们欢迎以下形式的文档贡献：

- 改进现有文档
- 添加新的使用示例
- 翻译文档到其他语言
- 修正文档中的错误

## 项目结构

```
src/
├── csharp/        # C# SDK
├── php/          # PHP SDK
└── javascript/   # JavaScript SDK
```

## 联系方式

- 📧 邮箱: bywbet@gmail.com
- 🌐 官网: https://www.byw.bet
- 💬 GitHub Issues: https://github.com/your-repo/byw-lottery-api-sdk/issues

感谢您的贡献！
