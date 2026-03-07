## 1. 添加后缀处理工具方法

- [x] 1.1 在 CodeGenerator 类中添加 `SUFFIXES_TO_REMOVE` 静态常量数组，包含 `['DAO', 'DO', 'Model']`
- [x] 1.2 实现 `normalizeClassName(className: string): string` 私有方法，用于去除 className 的后缀
- [x] 1.3 添加边界检查，确保去除后缀后不为空字符串

## 2. 修改模板上下文

- [x] 2.1 在 `buildTemplateContext` 方法中添加 `classNameNoSuffix` 变量
- [x] 2.2 在 `generateMapperXml` 方法中使用 `classNameNoSuffix` 生成 XML 文件名

## 3. 修改模板文件

- [x] 3.1 修改 `mapper.java.ejs`：类名和接口引用使用 `<%= classNameNoSuffix %>Mapper`
- [x] 3.2 修改 `service.java.ejs`：接口名使用 `<%= classNameNoSuffix %>Service`
- [x] 3.3 修改 `service-impl.java.ejs`：类名使用 `<%= classNameNoSuffix %>ServiceImpl`，依赖引用使用 `<%= classNameNoSuffix %>Mapper` 和 `<%= classNameNoSuffix %>Service`
- [x] 3.4 修改 `controller.java.ejs`：类名使用 `<%= classNameNoSuffix %>Api`，依赖引用使用 `<%= classNameNoSuffix %>Service`
- [x] 3.5 修改 `mapper.xml.ejs`：namespace 使用 `<%= classNameNoSuffix %>Mapper`

## 4. 验证与测试

- [x] 4.1 使用带有 `DAO` 后缀的 Entity 类进行测试
- [x] 4.2 使用带有 `DO` 后缀的 Entity 类进行测试
- [x] 4.3 使用带有 `Model` 后缀的 Entity 类进行测试
- [x] 4.4 使用无后缀的 Entity 类进行回归测试
