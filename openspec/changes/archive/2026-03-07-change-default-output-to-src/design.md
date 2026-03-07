## Context

当前默认输出目录 `./generated` 是独立目录，用户需要手动将生成的代码移动到项目源码目录。改为 `./src` 后可以直接集成。

## Goals / Non-Goals

**Goals:**
- 修改默认输出目录为 `./src`
- 保持 `-o` 选项可自定义输出目录

**Non-Goals:**
- 不改变代码生成的目录结构（仍然是 `src/main/java/...`）

## Decisions

**决策：直接修改 `--output` 选项的默认值**

只需修改 `cli.ts` 中 `.option('-o, --output <dir>', '输出目录（项目根目录）', './generated')` 的默认值即可。

## Risks / Trade-offs

- **风险**：如果用户在项目根目录运行，会直接在 `./src` 下生成文件
  - **缓解**：这是预期行为，符合 Maven/Gradle 项目结构

## Migration Plan

无需迁移，仅修改默认值。

## Open Questions

无。
