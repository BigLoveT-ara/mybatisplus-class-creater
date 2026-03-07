# 使用模板文件和改进输出路径

## 概述

将代码生成器的硬编码模板提取为独立的模板文件，并改进输出路径逻辑，使其根据 Java 类的包名自动生成对应的目录结构。

## 问题描述

当前代码生成器存在以下问题：

1. **模板硬编码**：所有代码模板都写在 `CodeGenerator.ts` 中，难以维护和自定义
2. **输出路径单一**：所有文件都输出到扁平的目录结构，不支持按包名分层
3. **缺少 XML 支持**：不生成 MyBatis Mapper XML 文件

## 变更目标

### 1. 模板文件化

将代码模板提取到 `templates/` 目录下的独立文件中：

```
templates/
├── mapper.java.ejs
├── service.java.ejs
├── service-impl.java.ejs
├── controller.java.ejs
└── mapper.xml.ejs
```

**注意**：Entity 实体类不需要生成，工具基于已有的 Entity 类来生成其他代码。

### 2. 输出路径改进

根据包名和层级自动生成目录结构：

| 类型 | 输出路径 |
|------|----------|
| Mapper | `{outputDir}/src/main/java/{basePackage}/mapper/{className}Mapper.java` |
| Service | `{outputDir}/src/main/java/{basePackage}/service/{className}Service.java` |
| ServiceImpl | `{outputDir}/src/main/java/{basePackage}/service/impl/{className}ServiceImpl.java` |
| Controller | `{outputDir}/src/main/java/{basePackage}/controller/{className}Controller.java` |
| Mapper XML | `{outputDir}/src/main/resources/mapper/{className}Mapper.xml` |

### 3. 新增 Mapper XML 生成

生成标准的 MyBatis XML Mapper 文件，包含：
- ResultMap 定义
- 基础列映射
- CRUD 操作 SQL

## 用户价值

1. **易于定制**：用户可以修改模板文件来自定义生成的代码
2. **符合规范**：输出目录结构符合 Maven/Gradle 标准项目结构
3. **完整支持**：同时生成 Java 代码和 XML 配置文件

## 非目标

- 不支持复杂的模板继承或包含
- 不支持运行时动态切换模板引擎
