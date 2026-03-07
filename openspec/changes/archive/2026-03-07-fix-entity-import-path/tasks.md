## 1. 修改模板文件

- [x] 1.1 修改 `templates/mapper.java.ejs`，将 Entity import 路径改为 `<%= entityPackage %>.<%= className %>`
- [x] 1.2 修改 `templates/service.java.ejs`，将 Entity import 路径改为 `<%= entityPackage %>.<%= className %>`
- [x] 1.3 修改 `templates/service-impl.java.ejs`，将 Entity import 路径改为 `<%= entityPackage %>.<%= className %>`
- [x] 1.4 修改 `templates/controller.java.ejs`，将 Entity import 路径改为 `<%= entityPackage %>.<%= className %>`

## 2. 验证

- [x] 2.1 重新编译项目 `npm run build`
- [x] 2.2 使用测试项目验证生成的代码 import 路径正确
