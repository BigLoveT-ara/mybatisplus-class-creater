### Requirement: 类名标准化处理
系统应当在生成 Mapper、Service、ServiceImpl、Api 等类时，自动去除 Entity 类名中的常见后缀（如 `DAO`、`DO`、`Model`），以确保生成的类名符合 Java 命名规范。

#### Scenario: Entity 类名带有 DAO 后缀
- **WHEN** Entity 类名为 `UserDAO`
- **THEN** 生成的 Mapper 类名为 `UserMapper`，Service 类名为 `UserService`

#### Scenario: Entity 类名带有 DO 后缀
- **WHEN** Entity 类名为 `OrderDO`
- **THEN** 生成的 Mapper 类名为 `OrderMapper`，Service 类名为 `OrderService`

#### Scenario: Entity 类名带有 Model 后缀
- **WHEN** Entity 类名为 `ProductModel`
- **THEN** 生成的 Mapper 类名为 `ProductMapper`，Service 类名为 `ProductService`

#### Scenario: Entity 类名没有常见后缀
- **WHEN** Entity 类名为 `User`（无后缀）
- **THEN** 生成的 Mapper 类名为 `UserMapper`，Service 类名为 `UserService`（保持不变）

#### Scenario: Entity 类名去除后缀后为空
- **WHEN** Entity 类名为 `DAO` 或 `DO` 或 `Model`（整个类名就是后缀）
- **THEN** 保持原始类名，不做处理
