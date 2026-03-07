## Context

当前 CodeGenerator.ts 在生成 Mapper、Service、ServiceImpl 和 Api 类时，直接使用 `javaClass.className` 作为基础名称。当 Entity 类名带有 `DAO`、`DO`、`Model` 等后缀时（如 `UserDAO`），生成的类名会变成 `UserDAOMapper`、`UserDAOService` 等，这不符合 Java 命名规范。

**约束条件：**
- 仅修改代码生成器逻辑，不修改现有模板文件
- 保持 Entity 类名不变，仅影响生成的关联类命名
- 支持常见的后缀：`DAO`、`DO`、`Model`

## Goals / Non-Goals

**Goals:**
- 在生成 Mapper、Service、ServiceImpl、Api 类时，自动去除 className 的后缀
- 提供一个可复用的后缀处理函数
- 保持配置化，允许未来扩展其他后缀

**Non-Goals:**
- 不修改 Entity 类的命名
- 不修改模板文件结构
- 不引入 breaking changes

## Decisions

### 1. 后缀处理方式

**方案：** 在 `CodeGenerator` 类中添加一个私有方法 `normalizeClassName`，专门负责去除 className 的后缀。

**理由：**
- 单一职责，便于测试和维护
- 可配置化，未来可以扩展支持更多后缀
- 不影响其他逻辑

### 2. 支持的 suffix 列表

**方案：** 使用静态常量数组定义 `['DAO', 'DO', 'Model']`

**理由：**
- 清晰可见，易于扩展
- 覆盖常见的命名后缀

### 3. 调用时机

**方案：** 在 `buildTemplateContext` 方法中添加 `classNameNoSuffix` 变量，供模板使用

**理由：**
- 保持模板上下文的原始数据不变（`className` 仍保留原始 Entity 类名）
- 模板可以灵活选择使用 `className`（实体类）或 `classNameNoSuffix`（生成类名）
- 降低耦合，模板自行决定何时使用标准化后的类名

### 4. 模板变量使用规范

**规范：**
- `<%= className %>`: 用于引用**实体类**（如 `BaseMapper<<%= className %>>`）
- `<%= classNameNoSuffix %>`: 用于生成**Mapper/Service/Api 类名**（如 `<%= classNameNoSuffix %>Mapper`）

## Risks / Trade-offs

**风险：** 如果 Entity 类名本身就是 `DAO`、`DO` 或 `Model`（极少见），会被处理成空字符串

**缓解：** 添加边界检查，确保返回的 className 不为空，如果去除后缀后为空，则返回原始 className
