import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { createGenerator } from './generator/CodeGenerator.js';
import { createPackageScanner } from './parser/PackageScanner.js';
import { parseJavaFile } from './parser/JavaParser.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 查找 package.json 的路径（向上查找最多 3 级）
function findPackageJson() {
    let currentDir = __dirname;
    for (let i = 0; i < 3; i++) {
        const pkgPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            return pkgPath;
        }
        currentDir = path.dirname(currentDir);
    }
    // 默认返回当前目录的 package.json
    return path.join(process.cwd(), 'package.json');
}
const packageJsonPath = findPackageJson();
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const program = new Command();
program
    .name('mp-class-creater')
    .description('MyBatis-Plus 代码生成器 - 解析 Java 实体并生成相关代码模板')
    .version(packageJson.version);
program
    .command('generate')
    .description('从 Java 实体类生成 MyBatis-Plus 相关代码（Mapper/Service/Api/XML）')
    .argument('<input>', '输入的 Java 文件或目录路径（通常是 entity 目录）')
    .option('-o, --output <dir>', '输出目录（项目根目录）', './')
    .option('-a, --author <author>', '作者名', 'Auto Generated')
    .option('--no-mapper', '不生成 Mapper 接口')
    .option('--no-service', '不生成 Service 接口')
    .option('--no-api', '不生成 Api 类')
    .option('--overwrite', '覆盖已存在的文件')
    .action(async (input, options) => {
    try {
        const inputPath = path.resolve(input);
        const outputPath = path.resolve(options.output);
        // 检查输入路径是否存在
        if (!fs.existsSync(inputPath)) {
            console.error(`错误：输入路径不存在：${inputPath}`);
            process.exit(1);
        }
        const stat = fs.statSync(inputPath);
        const packageScanner = createPackageScanner();
        let scanResult;
        if (stat.isFile()) {
            // 输入是单个文件
            if (!input.endsWith('.java')) {
                console.error(`错误：输入文件必须是 .java 文件：${inputPath}`);
                process.exit(1);
            }
            console.log(`解析文件：${inputPath}`);
            // 直接解析该文件
            const javaClass = parseJavaFile(inputPath);
            const entityPackage = javaClass.packageName;
            // 使用 PackageScanner 的方法推断基础包名
            const basePackage = packageScanner.inferBasePackage(entityPackage);
            scanResult = {
                basePackage,
                entityPackage,
                classes: [javaClass],
            };
        }
        else {
            // 输入是目录
            console.log(`扫描目录：${inputPath}`);
            scanResult = packageScanner.scan(inputPath);
        }
        if (scanResult.classes.length === 0) {
            console.warn('警告：未找到任何 Java 类');
            return;
        }
        console.log(`找到 ${scanResult.classes.length} 个 Java 类`);
        console.log(`推断基础包名：${scanResult.basePackage}`);
        console.log(`Entity 包名：${scanResult.entityPackage}`);
        // 创建生成器
        const generator = createGenerator({
            outputDir: outputPath,
            basePackage: scanResult.basePackage,
            entityPackage: scanResult.entityPackage,
            author: options.author,
            overwrite: options.overwrite,
            generateMapper: options.mapper,
            generateService: options.service,
            generateApi: options.api,
        });
        // 生成代码
        for (const javaClass of scanResult.classes) {
            console.log(`\n处理类：${javaClass.className}`);
            generator.generate(javaClass);
        }
        console.log('\n代码生成完成！');
        console.log('输出目录：' + outputPath);
    }
    catch (error) {
        console.error('生成失败:', error);
        process.exit(1);
    }
});
program
    .command('scan')
    .description('扫描 Java 项目目录，显示包结构信息')
    .argument('<dir>', '要扫描的目录（如 src/main/java/com/example/entity）')
    .action((dir) => {
    try {
        const scanDir = path.resolve(dir);
        const packageScanner = createPackageScanner();
        const scanResult = packageScanner.scan(scanDir);
        console.log('\n=== 扫描结果 ===');
        console.log(`基础包名：${scanResult.basePackage}`);
        console.log(`Entity 包名：${scanResult.entityPackage}`);
        console.log(`类数量：${scanResult.classes.length}`);
        console.log('\n--- 类列表 ---');
        for (const cls of scanResult.classes) {
            console.log(`  ${cls.packageName}.${cls.className}`);
        }
    }
    catch (error) {
        console.error('扫描失败:', error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=cli.js.map