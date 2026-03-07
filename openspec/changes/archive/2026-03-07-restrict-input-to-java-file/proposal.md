## Why

当前 `generate` 命令接受目录作为输入，会自动扫描目录下所有 Java 文件并生成代码。但用户希望更灵活地控制：能够指定单个 Java 文件，只生成该实体相关的代码，方便按需生成。

## What Changes

- **修改** `generate` 命令的 `<input>` 参数行为：
  - 支持单个 `.java` 文件路径作为输入
  - 支持目录路径作为输入（保持原有行为）
- 新增校验逻辑：如果输入是文件，验证是否为 `.java` 后缀
- 如果输入是目录，保持扫描所有 Java 文件的行为

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- 修改 `src/cli.ts` 中的 `generate` 命令 action 逻辑
- 需要调整 `PackageScanner` 或新增单文件解析逻辑
- **BREAKING**: 原来传入目录会生成所有实体的代码，现在如果希望只生成单个实体的代码，需要传入具体文件路径
