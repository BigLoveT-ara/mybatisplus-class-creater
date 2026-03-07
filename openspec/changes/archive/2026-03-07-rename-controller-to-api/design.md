## Context

当前代码生成器在生成 Controller 层代码时，固定使用 `controller` 包名和 `Controller` 后缀。部分项目希望使用 `api` 作为包名和 `Api` 后缀来命名 API 层代码。

当前涉及的文件：
- `src/generator/CodeGenerator.ts`：生成 Controller 的方法
- `src/cli.ts`：CLI 选项配置
- `src/utils/PathResolver.ts`：路径解析逻辑

## Goals / Non-Goals

**Goals:**
- 将生成的 Controller 包名从 `xxx.controller` 改为 `xxx.api`
- 将生成的类名从 `XxxController` 改为 `XxxApi`
- 更新 CLI 选项从 `--no-controller` 改为 `--no-api`
- 保持其他功能不变（Mapper/Service/XML 生成逻辑不受影响）

**Non-Goals:**
- 不修改已生成的代码文件
- 不修改 Service/Mapper 层的命名
- 不修改模板文件的内容结构

## Decisions

### 1. 配置项命名

**决策**：使用 `generateApi` 替代 `generateController` 作为配置项

**理由**：保持一致性，配置项、包名、类名统一使用 Api 术语

**替代方案考虑**：
- 保留 `generateController` 配置项，仅修改输出：会导致配置与输出不一致
- 同时支持两个配置项：增加复杂性，无实际收益

### 2. PathResolver 修改

**决策**：在 PathResolver 中添加 `api` 作为新的 LayerType

**理由**：PathResolver 负责解析各层代码的路径，需要识别 `api` 类型

### 3. CLI 参数

**决策**：将 `--no-controller` 改为 `--no-api`

**理由**：CLI 参数需要与生成功能保持一致

## Risks / Trade-offs

**[Risk]**: 已有用户使用 `--no-controller` 参数的脚本会失效

**Mitigation**: 可在一段时间内同时支持两个参数，`--no-controller` 作为别名

**[Trade-off]**: 修改配置项名称会破坏已有配置的兼容性
