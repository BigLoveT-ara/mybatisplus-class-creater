import { JavaClass } from '../types.js';
/**
 * Java 代码解析器
 */
export declare class JavaParser {
    private content;
    private filePath;
    constructor(filePath: string);
    /**
     * 解析 Java 文件
     */
    parse(): JavaClass;
    /**
     * 提取包名
     */
    private extractPackageName;
    /**
     * 提取导入语句
     */
    private extractImports;
    /**
     * 提取类名
     */
    private extractClassName;
    /**
     * 提取类注释
     */
    private extractClassComment;
    /**
     * 提取类注解
     */
    private extractClassAnnotations;
    /**
     * 提取父类
     */
    private extractSuperClass;
    /**
     * 提取实现的接口
     */
    private extractInterfaces;
    /**
     * 提取字段
     */
    private extractFields;
    /**
     * 提取方法
     */
    private extractMethods;
    /**
     * 解析方法参数
     */
    private parseParameters;
    /**
     * 解析注解
     */
    private parseAnnotations;
    /**
     * 解析注解属性
     */
    private parseAnnotationAttributes;
    /**
     * 清理注释文本
     */
    private cleanComment;
    /**
     * 移除方法体（避免在方法内部匹配字段）
     */
    private removeMethodBodies;
}
/**
 * 解析 Java 文件
 */
export declare function parseJavaFile(filePath: string): JavaClass;
/**
 * 解析目录下的所有 Java 文件
 */
export declare function parseJavaDirectory(dirPath: string): JavaClass[];
//# sourceMappingURL=JavaParser.d.ts.map