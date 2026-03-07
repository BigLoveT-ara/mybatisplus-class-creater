## Context

当前单文件输入时，`basePackage` 直接设置为 `javaClass.packageName`，即完整的包路径（如 `com.example.model`）。但 `PathResolver` 使用该包名构建输出路径，导致生成的代码位于错误的目录。

## Goals / Non-Goals

**Goals:**
- 单文件输入时，正确推断基础包名（移除 entity/bean 包名部分）
- 保持目录扫描的原有行为

**Non-Goals:**
- 不改变 `PathResolver` 的路径计算逻辑
- 不改变模板文件的输出结构

## Decisions

**决策：在单文件处理时复用 `PackageScanner` 的 `inferBasePackage` 方法**

利用已有的 `inferBasePackage` 方法，从完整的 entity 包名推断出基础包名。

## Risks / Trade-offs

- **风险**：无明显风险
- **权衡**：无

## Migration Plan

无需迁移。

## Open Questions

无。
