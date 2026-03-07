## Context

当前 `generate` 命令只支持目录输入，会扫描目录下所有 Java 文件。用户希望能够指定单个 Java 文件，只生成该实体相关的代码。

## Goals / Non-Goals

**Goals:**
- 支持单个 `.java` 文件路径作为输入
- 支持目录路径作为输入（保持原有行为）
- 对文件输入进行 `.java` 后缀验证

**Non-Goals:**
- 不改变目录扫描的行为
- 不改变代码生成逻辑

## Decisions

**决策：在 `generate` 命令 action 中新增输入类型判断**

- **方案 A**：在 `cli.ts` 中直接判断输入是文件还是目录，分别处理
  - ✅ 逻辑简单，改动最小
  - ✅ 文件情况直接解析单个文件，目录情况保持原有扫描逻辑

- **方案 B**：在 `PackageScanner` 中新增 `scanFile` 方法
  - ❌ 增加接口复杂度

选择方案 A。

## Risks / Trade-offs

- **风险**：无重大风险，仅新增输入校验逻辑

## Migration Plan

无需迁移计划，属于新增功能。

## Open Questions

无。
