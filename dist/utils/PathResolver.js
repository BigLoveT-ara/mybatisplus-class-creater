import * as fs from 'fs';
import * as path from 'path';
/**
 * 层级路径映射
 */
const LAYER_PATHS = {
    'mapper': 'src/main/java/{packagePath}/mapper',
    'service': 'src/main/java/{packagePath}/service',
    'service-impl': 'src/main/java/{packagePath}/service/impl',
    'api': 'src/main/java/{packagePath}/api',
    'mapper-xml': 'src/main/resources/mapper',
};
/**
 * 路径解析器
 *
 * 根据包名和层级计算输出路径
 */
export class PathResolver {
    /** 输出根目录 */
    outputDir;
    /**
     * 创建路径解析器
     * @param outputDir 输出根目录
     */
    constructor(outputDir) {
        this.outputDir = path.resolve(outputDir);
    }
    /**
     * 解析输出路径
     * @param basePackage 基础包名（如 com.example）
     * @param layer 层级类型
     * @param className 类名
     * @returns 解析结果
     */
    resolve(basePackage, layer, className) {
        const packagePath = basePackage.replace(/\./g, '/');
        // 获取路径模板
        const pathTemplate = LAYER_PATHS[layer];
        // 替换模板中的占位符
        let relativePath = pathTemplate.replace('{packagePath}', packagePath);
        // 构建文件名
        const fileName = layer === 'mapper-xml'
            ? `${className}Mapper.xml`
            : `${className}.java`;
        // 完整路径
        const filePath = path.join(this.outputDir, relativePath, fileName);
        const dirPath = path.dirname(filePath);
        return {
            filePath,
            dirPath,
            layer,
            className,
        };
    }
    /**
     * 写入文件（如果不存在）
     * @param filePath 文件路径
     * @param content 文件内容
     * @param overwrite 是否覆盖已存在的文件
     * @returns 写入结果
     */
    writeFileIfNotExists(filePath, content, overwrite = false) {
        // 检查文件是否已存在
        if (fs.existsSync(filePath)) {
            if (overwrite) {
                // 创建目录
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                // 写入文件
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`[已覆盖] ${filePath}`);
                return { written: true, skipped: false };
            }
            else {
                console.warn(`[跳过] 文件已存在：${filePath}`);
                return { written: false, skipped: true };
            }
        }
        // 创建目录
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        // 写入文件
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[已生成] ${filePath}`);
        return { written: true, skipped: false };
    }
}
/**
 * 创建路径解析器
 * @param outputDir 输出根目录
 */
export function createPathResolver(outputDir) {
    return new PathResolver(outputDir);
}
//# sourceMappingURL=PathResolver.js.map