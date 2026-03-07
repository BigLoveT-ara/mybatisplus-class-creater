# 设计文档

## 架构设计

### 模块结构

```
src/
├── cli.ts                    # 命令行入口
├── types.ts                  # 类型定义
├── parser/
│   ├── JavaParser.ts         # Java 解析器
│   └── PackageScanner.ts     # 新增：包扫描器
├── generator/
│   ├── CodeGenerator.ts      # 代码生成器（重构后）
│   └── TemplateEngine.ts     # 新增：模板引擎
└── templates/
    ├── mapper.java.ejs
    ├── service.java.ejs
    ├── service-impl.java.ejs
    ├── controller.java.ejs
    └── mapper.xml.ejs
```

## 详细设计

### 1. 模板引擎模块

创建新的 `TemplateEngine` 类，负责加载和渲染模板：

```typescript
export interface TemplateContext {
  className: string;
  packageName: string;
  fields: JavaField[];
  tableInfo: TableInfo;
  author: string;
  date: string;
}

export class TemplateEngine {
  private static readonly DEFAULT_TEMPLATES_DIR = path.join(__dirname, '../../templates');
  private templatesDir: string;

  constructor(templatesDir?: string);
  render(templateName: string, context: TemplateContext): string;
}
```

**说明**：
- `templatesDir` 参数主要用于开发和测试场景
- 默认使用项目根目录下的 `templates/` 目录
- CLI 不需要暴露 `--template-dir` 参数

### 2. 包扫描器模块

创建 `PackageScanner` 类，用于扫描 Java 项目中的包结构：

```typescript
export interface ScanResult {
  basePackage: string;       // 基础包名，如 com.example
  entityPackage: string;     // Entity 所在包，如 com.example.entity
  classes: JavaClass[];      // 解析后的类列表
}

export class PackageScanner {
  /**
   * 扫描指定目录，自动识别包结构
   * @param scanDir 要扫描的目录（如 src/main/java/com/example/entity）
   */
  scan(scanDir: string): ScanResult;

  /**
   * 从 Entity 包名推断基础包名
   * 如 com.example.entity → com.example
   */
  inferBasePackage(entityPackage: string): string;
}
```

**包名推断规则**：

| 扫描目录 | 推断的 basePackage |
|----------|-------------------|
| `.../com/example/entity` | `com.example` |
| `.../com/example/bean` | `com.example` |
| `.../com/example/model` | `com.example` |
| `.../com/example/domain` | `com.example` |

### 3. 输出路径计算

```typescript
export function resolveOutputPath(
  outputDir: string,
  basePackage: string,
  layer: LayerType,
  className: string
): string {
  const packagePath = basePackage.replace(/\./g, '/');

  const layerPaths: Record<LayerType, string> = {
    'mapper': `src/main/java/${packagePath}/mapper`,
    'service': `src/main/java/${packagePath}/service`,
    'service-impl': `src/main/java/${packagePath}/service/impl`,
    'controller': `src/main/java/${packagePath}/controller`,
    'mapper-xml': `src/main/resources/mapper`,
  };

  const fileName = layer === 'mapper-xml'
    ? `${className}Mapper.xml`
    : `${className}.java`;

  return path.join(outputDir, layerPaths[layer], fileName);
}
```

### 4. 文件存在检查

```typescript
export function writeFileIfNotExists(
  filePath: string,
  content: string
): { written: boolean; skipped: boolean } {
  if (fs.existsSync(filePath)) {
    console.warn(`[跳过] 文件已存在：${filePath}`);
    return { written: false, skipped: true };
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`[已生成] ${filePath}`);
  return { written: true, skipped: false };
}
```

### 5. 模板文件设计

```
// mapper.java.ejs
package <%= packageName %>.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import <%= packageName %>.entity.<%= className %>;
import org.apache.ibatis.annotations.Mapper;

/**
 * <%= tableInfo.tableComment %> Mapper 接口
 * @author <%= author %>
 */
@Mapper
public interface <%= className %>Mapper extends BaseMapper<<%= className %>> {

}
```

### 6. 模板变量定义

| 变量 | 说明 |
|------|------|
| `<%= className %>` | 类名 |
| `<%= packageName %>` | 完整包名（如 com.example） |
| `<%= fieldName %>` | 字段名 |
| `<%= fieldType %>` | 字段类型 |
| `<%= columnName %>` | 列名 |
| `<%= tableInfo.tableName %>` | 表名 |
| `<%= tableInfo.tableComment %>` | 表注释 |
| `<%= author %>` | 作者 |
| `<%= date %>` | 生成日期 |

## 数据结构

### TemplateContext

```typescript
interface TemplateContext {
  // 类信息
  className: string;
  packageName: string;    // 从扫描结果获取

  // 表信息
  tableInfo: {
    tableName: string;
    tableComment: string;
  };

  // 字段列表
  fields: Array<{
    fieldName: string;
    fieldType: string;
    columnName?: string;
    isPrimaryKey?: boolean;
    comment?: string;
  }>;

  // 生成配置
  author: string;
  date: string;
}
```

### ScanResult

```typescript
interface ScanResult {
  basePackage: string;       // 推断出的基础包名
  entityPackage: string;     // Entity 所在包
  classes: JavaClass[];      // 解析后的类列表
}
```

## 依赖关系

```
CodeGenerator
  ├── TemplateEngine (新增)
  ├── PackageScanner (新增)
  └── JavaParser (现有)
```

## CLI 参数设计

### generate 命令

```bash
mp-class-creater generate <input> [选项]
```

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `<input>` | string | 是 | - | 输入的 Java 文件或目录路径 |
| `-o, --output <dir>` | string | 否 | `./generated` | 输出目录 |
| `-a, --author <author>` | string | 否 | `Auto Generated` | 作者名 |
| `--no-mapper` | boolean | 否 | false | 不生成 Mapper 接口 |
| `--no-service` | boolean | 否 | false | 不生成 Service 接口 |
| `--no-controller` | boolean | 否 | false | 不生成 Controller 类 |
| `--overwrite` | boolean | 否 | false | 覆盖已存在的文件 |

**移除的参数**：
- ~~`-p, --package <prefix>`~~ - 改为自动扫描推断
- ~~`--no-entity`~~ - Entity 不再生成
