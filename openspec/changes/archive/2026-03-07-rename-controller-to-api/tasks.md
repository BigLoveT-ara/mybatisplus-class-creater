## 1. 核心实现

- [x] 1.1 修改 CodeGenerator.ts 中的配置项 `generateController` 改为 `generateApi`
- [x] 1.2 修改 CodeGenerator.ts 中的 `generateController` 方法名为 `generateApi`
- [x] 1.3 修改 CodeGenerator.ts 中的包路径从 `controller` 改为 `api`
- [x] 1.4 修改 CodeGenerator.ts 中的类名从 `${className}Controller` 改为 `${className}Api`

## 2. CLI 配置修改

- [x] 2.1 修改 cli.ts 中的命令描述从 `Controller` 改为 `Api`
- [x] 2.2 修改 cli.ts 中的选项从 `--no-controller` 改为 `--no-api`
- [x] 2.3 修改 cli.ts 中的配置项引用从 `controller` 改为 `api`

## 3. PathResolver 修改

- [x] 3.1 修改 PathResolver.ts 中的 LayerType 添加 `api` 类型
- [x] 3.2 确保 `api` 层路径解析正确

## 4. 验证与测试

- [x] 4.1 运行 `npm run build` 确保编译通过
- [x] 4.2 测试代码生成功能是否正常生成 Api 类
- [x] 4.3 测试 `--no-api` 选项是否正常工作
