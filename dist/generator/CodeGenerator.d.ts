import { JavaClass } from '../types.js';
/**
 * 代码生成器配置
 */
export interface GeneratorConfig {
    /** 输出目录 */
    outputDir: string;
    /** 作者名 */
    author?: string;
    /** 是否覆盖已存在的文件 */
    overwrite?: boolean;
    /** 生成 Mapper */
    generateMapper?: boolean;
    /** 生成 Service */
    generateService?: boolean;
    /** 生成 Api */
    generateApi?: boolean;
    /** 基础包名 */
    basePackage?: string;
    /** Entity 包名 */
    entityPackage?: string;
}
/**
 * 代码生成器
 */
export declare class CodeGenerator {
    private config;
    private templateEngine;
    private pathResolver;
    /** 需要去除的常见后缀 */
    private static readonly SUFFIXES_TO_REMOVE;
    constructor(config: GeneratorConfig);
    /**
     * 从 Java 类生成代码
     */
    generate(javaClass: JavaClass): void;
    /**
     * 提取表信息
     */
    private extractTableInfo;
    /**
     * 构建模板上下文
     */
    private buildTemplateContext;
    /**
     * 生成 Mapper 接口
     */
    private generateMapper;
    /**
     * 生成 Service 接口
     */
    private generateService;
    /**
     * 生成 Service 实现类
     */
    private generateServiceImpl;
    /**
     * 生成 Api 类
     */
    private generateApi;
    /**
     * 生成 Mapper XML
     */
    private generateMapperXml;
    /**
     * 生成 ResultMap 行
     */
    private generateResultMapLines;
    /**
     * 生成列列表行
     */
    private generateColumnListLines;
    /**
     * 获取 Java 类型全名
     */
    private getJavaType;
    /**
     * 驼峰转蛇形
     */
    private camelToSnake;
    /**
     * 首字母小写
     */
    private firstLower;
    /**
     * 去除类名的常见后缀（如 DAO, DO, Model）
     */
    private normalizeClassName;
}
/**
 * 创建代码生成器
 */
export declare function createGenerator(config: GeneratorConfig): CodeGenerator;
//# sourceMappingURL=CodeGenerator.d.ts.map