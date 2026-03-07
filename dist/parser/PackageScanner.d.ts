import { JavaClass } from '../types.js';
/**
 * 扫描结果
 */
export interface ScanResult {
    /** 基础包名，如 com.example */
    basePackage: string;
    /** Entity 所在包，如 com.example.entity */
    entityPackage: string;
    /** 解析后的类列表 */
    classes: JavaClass[];
}
/**
 * 包扫描器
 *
 * 用于扫描 Java 项目目录，自动推断包结构
 */
export declare class PackageScanner {
    /**
     * 扫描指定目录，自动识别包结构
     * @param scanDir 要扫描的目录（如 src/main/java/com/example/entity）
     * @returns 扫描结果
     */
    scan(scanDir: string): ScanResult;
    /**
     * 查找目录下所有 Java 文件
     */
    private findJavaFiles;
    /**
     * 推断包名信息
     * @param scanDir 扫描目录
     * @param classes 解析后的类列表
     * @returns 包名信息
     */
    private inferPackageInfo;
    /**
     * 从 Entity 包名推断基础包名
     * 如 com.example.entity.bean → com.example
     * 只保留第一次出现常见包名之前的部分
     *
     * @param entityPackage Entity 所在包
     * @returns 基础包名
     */
    inferBasePackage(entityPackage: string): string;
    /**
     * 扫描项目根目录，自动查找 Entity 目录
     * @param projectRoot 项目根目录（包含 pom.xml 或 build.gradle 的目录）
     * @returns 扫描结果
     */
    scanFromProjectRoot(projectRoot: string): ScanResult;
    /**
     * 在 Java 源码目录下查找 Entity 目录
     */
    private findEntityDirectory;
}
/**
 * 创建包扫描器
 */
export declare function createPackageScanner(): PackageScanner;
//# sourceMappingURL=PackageScanner.d.ts.map