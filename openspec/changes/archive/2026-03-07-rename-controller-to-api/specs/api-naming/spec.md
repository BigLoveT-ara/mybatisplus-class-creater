## ADDED Requirements

### Requirement: Api 层代码生成

系统应当支持将生成的 Controller 层代码使用 Api 命名约定，包括包名和类名。

#### Scenario: 生成 Api 类
- **WHEN** 用户运行代码生成器且启用 Api 生成选项
- **THEN** 系统生成 `XxxApi` 类而非 `XxxController`

#### Scenario: Api 包名解析
- **WHEN** 代码生成器解析 Api 层路径
- **THEN** 系统使用 `xxx.api` 包名而非 `xxx.controller`

#### Scenario: 禁用 Api 生成
- **WHEN** 用户使用 `--no-api` 选项运行
- **THEN** 系统不生成 Api 层代码
