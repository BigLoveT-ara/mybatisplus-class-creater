## Why

当前所有模板中 Entity 类的引入路径硬编码为 `<%= basePackage %>.entity.<%= className %>`，但实际项目中 Entity 类可能位于不同的包路径下（如 `com.example.pojo`、`com.example.model`、`com.example.domain` 等）。这导致生成的代码中 import 路径错误，需要手动修改。

## What Changes

- 修改模板中 Entity 类的引入方式，使用解析后的实际 `entityPackage` 而非硬编码的 `.entity` 路径
- 影响以下模板文件：
  - `mapper.java.ejs`
  - `service.java.ejs`
  - `service-impl.java.ejs`
  - `controller.java.ejs`

## Capabilities

### New Capabilities
<!-- 无新能力，仅修改现有模板逻辑 -->

### Modified Capabilities
<!-- 无规范级变更，仅实现细节调整 -->

## Impact

- 修改 4 个 EJS 模板文件
- 生成的代码中 Entity import 路径将与实际 Entity 所在包路径一致
- 非破坏性变更，生成的代码更准确
