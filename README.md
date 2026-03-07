# MyBatis-Plus Class Creater

一个用于解析 Java 代码并生成 MyBatis-Plus 相关代码模板的 Node.js 本地工具。

## 功能特性

- 解析 Java 实体类文件，提取类结构信息
- 自动生成 MyBatis-Plus 相关的代码模板：
  - Entity 实体类
  - Mapper 接口
  - Service 接口
  - Controller 控制器
- 支持批量解析目录下的所有 Java 文件
- 可自定义输出目录、包名前缀、作者名等配置

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 安装

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 全局链接（可选）
npm link
```

## 使用方法

### 1. 直接运行（开发模式）

```bash
# 使用 tsx 直接运行 TypeScript 源码
npm run dev generate <输入文件/目录> [选项]
```

### 2. 构建后运行

```bash
# 先构建项目
npm run build

# 运行编译后的代码
npm run start generate <输入文件/目录> [选项]
```

### 3. 使用全局命令（npm link 后）

```bash
mp-class-creater generate <输入文件/目录> [选项]
```

## 命令说明

### generate 命令

从 Java 实体类生成 MyBatis-Plus 相关代码。

```bash
mp-class-creater generate <input> [选项]
```

**参数：**
- `<input>` - 输入的 Java 文件或目录路径（必填）

**选项：**
| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-o, --output <dir>` | 输出目录 | `./generated` |
| `-p, --package <prefix>` | 包名前缀 | `com.example` |
| `-a, --author <author>` | 作者名 | `Auto Generated` |
| `--no-entity` | 不生成 Entity 类 | - |
| `--no-mapper` | 不生成 Mapper 接口 | - |
| `--no-service` | 不生成 Service 接口 | - |
| `--no-controller` | 不生成 Controller 类 | - |
| `--overwrite` | 覆盖已存在的文件 | false |

### parse 命令

解析 Java 文件并显示结构信息（用于调试）。

```bash
mp-class-creater parse <file>
```

## 使用示例

### 示例 1：生成单个文件的代码

```bash
# 使用开发模式
npm run dev generate ./examples/User.java -o ./output -p com.myapp

# 或使用构建后的版本
npm run build
npm run start generate ./examples/User.java -o ./output -p com.myapp
```

### 示例 2：批量生成目录下所有 Java 文件

```bash
npm run dev generate ./src/main/java/com/example/entity -o ./generated -p com.myapp --author "张三"
```

### 示例 3：只生成 Mapper 和 Service

```bash
npm run dev generate ./examples/User.java --no-entity --no-controller
```

### 示例 4：查看 Java 文件结构

```bash
npm run dev parse ./examples/User.java
```

输出示例：
```
=== Java 类结构信息 ===
包名：com.example.demo.entity
类名：User
注释：用户信息实体 用于演示代码生成器功能
父类：无
接口：无

--- 字段列表 ---
  Long id
    注释：主键 ID
    主键
  String userName
    注释：用户名
    列名：user_name
  ...
```

## 生成的代码示例

输入 `User.java` 实体类后，工具会生成以下文件：

```
output/
├── entity/
│   └── User.java
├── mapper/
│   └── UserMapper.java
├── service/
│   ├── UserService.java
│   └── impl/
│       └── UserServiceImpl.java
└── controller/
    └── UserController.java
```

## 项目结构

```
mybatisplus-class-creater/
├── src/
│   ├── cli.ts              # 命令行入口
│   ├── types.ts            # TypeScript 类型定义
│   ├── parser/
│   │   └── JavaParser.ts   # Java 代码解析器
│   └── generator/
│       └── CodeGenerator.ts # 代码生成器
├── examples/               # 示例 Java 文件
├── templates/              # 代码模板目录（预留）
├── package.json
├── tsconfig.json
└── README.md
```

## NPM 脚本

| 脚本 | 说明 |
|------|------|
| `npm run build` | 使用 TypeScript 编译源码 |
| `npm run dev` | 使用 tsx 直接运行（无需编译） |
| `npm run start` | 运行编译后的代码 |
| `npm run clean` | 删除编译输出目录 |
| `npm run rebuild` | 清理并重新构建 |
| `npm run link:local` | 全局链接到本地 npm |

## 扩展开发

### 添加新的代码生成器

在 `src/generator/` 目录下创建新的生成器类，实现特定的代码生成逻辑。

### 修改模板

目前模板代码直接写在 `CodeGenerator.ts` 中，后续可以将模板提取为独立的模板文件（如使用 EJS、Handlebars 等模板引擎）。

## 注意事项

1. 解析器使用正则表达式匹配 Java 代码结构，对于特别复杂的 Java 语法可能无法完全解析
2. 建议将输入文件保持为标准的 MyBatis-Plus 实体类格式
3. 生成代码时默认不会覆盖已存在的文件，如需覆盖请添加 `--overwrite` 参数

## License

MIT
