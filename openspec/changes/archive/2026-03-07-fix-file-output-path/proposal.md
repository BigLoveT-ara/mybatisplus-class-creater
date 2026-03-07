## Why

当输入单个 Java 文件时，`basePackage` 被设置为完整的 entity 包路径（如 `com.example.model`），导致生成的 Mapper/Service/Controller 等文件输出到错误的目录。例如，Mapper 会输出到 `./src/main/java/com/example/model/mapper/` 而不是期望的 `./src/main/java/com/example/mapper/`。

## What Changes

- 修改 `cli.ts` 中处理单文件输入时的 `basePackage` 推断逻辑
- 从 `entityPackage` 中移除最后一部分（entity/bean 包名），得到基础包名
- 保持目录扫描的原有行为不变

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- 修改 `src/cli.ts` 中单文件输入的处理逻辑
- 生成的代码目录结构更符合 Maven/Gradle 项目规范
