import * as fs from 'fs';
import * as path from 'path';
import { JavaClass } from '../types.js';
import { parseJavaFile } from './JavaParser.js';

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
 * 常见的 Entity 包名模式
 */
const ENTITY_PACKAGE_PATTERNS = ['entity', 'bean', 'model', 'domain', 'po', 'dto'];

/**
 * 包扫描器
 *
 * 用于扫描 Java 项目目录，自动推断包结构
 */
export class PackageScanner {
  /**
   * 扫描指定目录，自动识别包结构
   * @param scanDir 要扫描的目录（如 src/main/java/com/example/entity）
   * @returns 扫描结果
   */
  scan(scanDir: string): ScanResult {
    const absolutePath = path.resolve(scanDir);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`扫描目录不存在：${absolutePath}`);
    }

    // 扫描所有 Java 文件
    const javaFiles = this.findJavaFiles(absolutePath);

    if (javaFiles.length === 0) {
      throw new Error(`在目录 ${absolutePath} 下未找到 Java 文件`);
    }

    // 解析所有 Java 文件
    const classes: JavaClass[] = [];
    for (const file of javaFiles) {
      try {
        const javaClass = parseJavaFile(file);
        classes.push(javaClass);
      } catch (error) {
        console.warn(`解析文件失败：${file}`, error);
      }
    }

    // 推断包名
    const { entityPackage, basePackage } = this.inferPackageInfo(absolutePath, classes);

    return {
      basePackage,
      entityPackage,
      classes,
    };
  }

  /**
   * 查找目录下所有 Java 文件
   */
  private findJavaFiles(dir: string): string[] {
    const results: string[] = [];

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results.push(...this.findJavaFiles(fullPath));
      } else if (file.endsWith('.java')) {
        results.push(fullPath);
      }
    }

    return results;
  }

  /**
   * 推断包名信息
   * @param scanDir 扫描目录
   * @param classes 解析后的类列表
   * @returns 包名信息
   */
  private inferPackageInfo(scanDir: string, classes: JavaClass[]): {
    entityPackage: string;
    basePackage: string;
  } {
    // 从第一个类获取包名
    if (classes.length === 0) {
      return {
        entityPackage: '',
        basePackage: '',
      };
    }

    // 使用第一个类的包名作为 entity 包名
    const firstClass = classes[0];
    const entityPackage = firstClass.packageName;

    // 推断基础包名
    const basePackage = this.inferBasePackage(entityPackage);

    return {
      entityPackage,
      basePackage,
    };
  }

  /**
   * 从 Entity 包名推断基础包名
   * 如 com.example.entity.bean → com.example
   * 只保留第一次出现常见包名之前的部分
   *
   * @param entityPackage Entity 所在包
   * @returns 基础包名
   */
  inferBasePackage(entityPackage: string): string {
    if (!entityPackage) {
      return '';
    }

    const parts = entityPackage.split('.');

    // 找到第一个常见包名模式的位置
    for (let i = 0; i < parts.length; i++) {
      if (ENTITY_PACKAGE_PATTERNS.includes(parts[i])) {
        // 返回第一个常见包名之前的部分
        return parts.slice(0, i).join('.');
      }
    }

    // 如果没有找到常见模式，返回原包名
    return entityPackage;
  }

  /**
   * 扫描项目根目录，自动查找 Entity 目录
   * @param projectRoot 项目根目录（包含 pom.xml 或 build.gradle 的目录）
   * @returns 扫描结果
   */
  scanFromProjectRoot(projectRoot: string): ScanResult {
    const javaRoot = path.join(projectRoot, 'src', 'main', 'java');

    if (!fs.existsSync(javaRoot)) {
      throw new Error(`未找到 Java 源码目录：${javaRoot}`);
    }

    // 查找 Entity 目录
    const entityDir = this.findEntityDirectory(javaRoot);

    if (!entityDir) {
      throw new Error(
        `未找到 Entity 目录，请确保存在 src/main/java/{package}/entity 或类似结构的目录`
      );
    }

    return this.scan(entityDir);
  }

  /**
   * 在 Java 源码目录下查找 Entity 目录
   */
  private findEntityDirectory(dir: string): string | null {
    // 检查当前目录是否是 Entity 目录
    const dirName = path.basename(dir);
    if (ENTITY_PACKAGE_PATTERNS.includes(dirName)) {
      return dir;
    }

    // 递归查找子目录
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 检查目录名是否是 Entity 包名模式
        if (ENTITY_PACKAGE_PATTERNS.includes(file)) {
          return fullPath;
        }

        // 递归查找
        const result = this.findEntityDirectory(fullPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}

/**
 * 创建包扫描器
 */
export function createPackageScanner(): PackageScanner {
  return new PackageScanner();
}
