## Why

将生成的代码中的 Controller 命名统一修改为 Api，以符合部分项目的命名规范需求，使代码风格更加灵活可配置。

## What Changes

- **包名变更**：生成的代码包名从 `xxx.controller` 改为 `xxx.api`
- **类名变更**：生成的类名从 `XxxController` 改为 `XxxApi`
- **配置项变更**：`--no-controller` 选项改为 `--no-api`
- **BREAKING**: 已生成的 Controller 文件需要手动迁移或重新生成

## Capabilities

### New Capabilities

- `api-naming`: 支持将生成的 Controller 层代码使用 Api 命名约定，包括包名和类名

### Modified Capabilities

- 无

## Impact

- **代码生成器**：`CodeGenerator.ts` 中的 `generateController` 方法及相关配置
- **CLI**：`cli.ts` 中的 `--no-controller` 选项需要改为 `--no-api`
- **模板文件**：`controller.java.ejs` 模板可能需要调整（如果模板中硬编码了 Controller 相关命名）
- **PathResolver**：可能需要支持 `api` 作为新的 layer 类型
