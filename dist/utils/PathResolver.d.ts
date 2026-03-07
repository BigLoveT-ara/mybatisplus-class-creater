/**
 * 层级类型
 */
export type LayerType = 'mapper' | 'service' | 'service-impl' | 'api' | 'mapper-xml';
/**
 * 路径解析结果
 */
export interface PathResolveResult {
    /** 输出文件路径 */
    filePath: string;
    /** 目录路径 */
    dirPath: string;
    /** 文件类型 */
    layer: LayerType;
    /** 类名 */
    className: string;
}
/**
 * 路径解析器
 *
 * 根据包名和层级计算输出路径
 */
export declare class PathResolver {
    /** 输出根目录 */
    private outputDir;
    /**
     * 创建路径解析器
     * @param outputDir 输出根目录
     */
    constructor(outputDir: string);
    /**
     * 解析输出路径
     * @param basePackage 基础包名（如 com.example）
     * @param layer 层级类型
     * @param className 类名
     * @returns 解析结果
     */
    resolve(basePackage: string, layer: LayerType, className: string): PathResolveResult;
    /**
     * 写入文件（如果不存在）
     * @param filePath 文件路径
     * @param content 文件内容
     * @param overwrite 是否覆盖已存在的文件
     * @returns 写入结果
     */
    writeFileIfNotExists(filePath: string, content: string, overwrite?: boolean): {
        written: boolean;
        skipped: boolean;
    };
}
/**
 * 创建路径解析器
 * @param outputDir 输出根目录
 */
export declare function createPathResolver(outputDir: string): PathResolver;
//# sourceMappingURL=PathResolver.d.ts.map