# 实现任务

## 任务列表

### 1. 创建模板引擎模块

**文件**: `src/utils/TemplateEngine.ts`

创建模板引擎类，支持简单的占位符替换语法。

**要求**:
- 支持 `<%= variable %>` 变量替换
- 支持 `<%~ array %>` 数组展开（生成多行）
- 从文件系统加载模板
- 默认模板路径为项目根目录的 `templates/`
- `templatesDir` 参数主要用于开发和测试

---

### 2. 创建包扫描器模块

**文件**: `src/parser/PackageScanner.ts`

扫描 Java 项目目录，自动推断包结构。

**要求**:
- 扫描指定目录下的 `.java` 文件
- 从目录结构推断基础包名（如 `com/example/entity` → `com.example`）
- 支持常见的 Entity 包名模式：`entity`, `bean`, `model`, `domain`
- 返回解析后的 `JavaClass[]` 和包信息

---

### 3. 创建路径解析工具

**文件**: `src/utils/PathResolver.ts`

根据包名和层级计算输出路径。

**要求**:
- 支持 mapper/service/service-impl/controller/mapper-xml 五种类型
- 自动生成符合 Maven 标准的目录结构
- Mapper XML 输出到 resources 目录
- 文件存在时返回跳过状态

---

### 4. 创建模板文件

**目录**: `templates/`

创建以下模板文件：

- `mapper.java.ejs` - Mapper 接口模板
- `service.java.ejs` - Service 接口模板
- `service-impl.java.ejs` - Service 实现类模板
- `controller.java.ejs` - Controller 控制器模板
- `mapper.xml.ejs` - MyBatis XML 映射文件模板

---

### 5. 重构代码生成器

**文件**: `src/generator/CodeGenerator.ts`

重构 `CodeGenerator` 类，使用新的模板引擎。

**修改内容**:
- 移除硬编码的模板字符串
- 使用 `TemplateEngine` 渲染模板
- 使用 `PackageScanner` 获取包信息
- 使用 `PathResolver` 计算输出路径
- 新增 XML 文件生成逻辑
- 新增文件存在检查逻辑

---

### 6. 更新 CLI 入口

**文件**: `src/cli.ts`

更新命令行参数和说明。

**修改内容**:
- 移除 `--no-entity` 参数（不再生成 Entity）
- 移除 `-p, --package` 参数（改为自动扫描）
- 更新 `generate` 命令的逻辑，使用 `PackageScanner`
- 保留 `--overwrite` 参数用于覆盖已存在的文件

---

### 7. 更新文档

**文件**: `README.md`

更新使用文档：
- 更新输出目录结构说明
- 更新 CLI 参数说明
- 添加文件存在检查的说明
- 添加自定义模板示例

---

## 验证步骤

1. 编译项目：`npm run build`
2. 测试扫描：`node dist/cli.js generate examples/ -o ./test-output`
3. 验证目录结构符合 Maven 标准
4. 验证生成的 XML 文件正确
5. 测试文件存在检查：再次运行生成命令，确认跳过已存在文件
