## Why

当 Entity 类名带有 `DAO`、`DO`、`Model` 等后缀时（如 `UserDAO`），生成的 Mapper、Service 等类会包含冗余后缀（如 `UserDAOMapper`、`UserDAOService`），不符合命名规范。需要自动去除这些后缀，生成更简洁的类名（如 `UserMapper`、`UserService`）。

## What Changes

- 在 CodeGenerator.ts 中添加后缀处理逻辑，自动识别并去除 className 的 `DAO`、`DO`、`Model` 等后缀
- 生成 Mapper、Service、ServiceImpl、Api 等类时，使用去除后缀后的 className
- 保持 Entity 类名不变（仅影响生成的关联类命名）

## Capabilities

### New Capabilities

- `class-name-normalization`: 在生成代码前对 className 进行标准化处理，去除常见的后缀

### Modified Capabilities

## Impact

- 修改 CodeGenerator.ts 中的 `generateMapper`、`generateService`、`generateServiceImpl`、`generateApi` 方法
- 可能需要修改 `buildTemplateContext` 方法，在模板上下文中提供标准化后的 className
- 不影响现有模板文件，仅修改生成器逻辑
