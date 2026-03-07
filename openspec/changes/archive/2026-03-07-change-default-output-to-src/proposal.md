## Why

当前默认输出目录为 `./generated`，生成的代码位于项目根目录外的独立目录。但用户更希望代码直接生成到项目源码目录 `./src` 下，便于直接集成到现有项目中，无需手动移动文件。

## What Changes

- **修改** `generate` 命令的 `-o, --output` 选项默认值：从 `./generated` 改为 `./src`
- 生成的代码将直接输出到 `src/main/java/...` 和 `src/main/resources/...` 目录

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- 修改 `src/cli.ts` 中 `generate` 命令的 `--output` 选项默认值
- **BREAKING**: 原有用户如果不指定输出目录，代码会生成到 `./src` 而非 `./generated`
