## Context

当前模板系统使用 `<%= basePackage %>.entity.<%= className %>` 硬编码方式引入 Entity 类。但 `PackageScanner` 已经正确解析出 `entityPackage`（如 `com.example.entity`、`com.example.model` 等），只是模板中未使用该值。

## Goals / Non-Goals

**Goals:**
- 修改模板使用 `entityPackage` 变量引入 Entity 类
- 确保生成的代码 import 路径与实际 Entity 包路径一致

**Non-Goals:**
- 不改变 `PackageScanner` 的解析逻辑
- 不改变代码生成器的其他功能

## Decisions

**决策：使用 `entityPackage` 变量替代硬编码路径**

- **方案 A**：修改模板，使用 `<%= entityPackage %>.<%= className %>`
  - ✅ 简单直接，只需修改模板
  - ✅ 利用已解析的正确包路径
  - ✅ 代码改动最小

- **方案 B**：在生成器中动态计算 import 路径
  - ❌ 增加复杂度
  - ❌ 需要修改多个文件

选择方案 A。

## Risks / Trade-offs

- **风险**：如果 `entityPackage` 为空，import 路径会出错
  - **缓解**：`PackageScanner` 已保证 `entityPackage` 至少包含类所在的包路径

## Migration Plan

无需迁移计划，仅修改模板文件，不影响已有功能。

## Open Questions

无。
