## 1. 修改 cli.ts 中的单文件处理逻辑

- [x] 1.1 在单文件输入时，使用 `PackageScanner` 的 `inferBasePackage` 方法从 `entityPackage` 推断 `basePackage`
- [x] 1.2 保持目录扫描的原有行为不变

## 2. 验证

- [x] 2.2 测试单文件输入时输出路径正确
- [x] 2.3 测试目录输入时输出路径正确
