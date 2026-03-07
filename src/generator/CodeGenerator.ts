import * as fs from 'fs';
import * as path from 'path';
import { JavaClass, JavaField, TableInfo } from '../types.js';
import { TemplateEngine } from '../utils/TemplateEngine.js';
import { PathResolver, LayerType } from '../utils/PathResolver.js';

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
export class CodeGenerator {
  private config: Required<GeneratorConfig>;
  private templateEngine: TemplateEngine;
  private pathResolver: PathResolver;

  /** 需要去除的常见后缀 */
  private static readonly SUFFIXES_TO_REMOVE = ['DAO', 'DO', 'Model'];

  constructor(config: GeneratorConfig) {
    this.config = {
      overwrite: config.overwrite ?? false,
      generateMapper: config.generateMapper ?? true,
      generateService: config.generateService ?? true,
      generateApi: config.generateApi ?? true,
      author: config.author ?? 'Auto Generated',
      basePackage: config.basePackage || '',
      entityPackage: config.entityPackage || '',
      outputDir: config.outputDir,
    };

    this.templateEngine = new TemplateEngine();
    this.pathResolver = new PathResolver(config.outputDir || './generated');
  }

  /**
   * 从 Java 类生成代码
   */
  generate(javaClass: JavaClass): void {
    const tableInfo = this.extractTableInfo(javaClass);
    const context = this.buildTemplateContext(javaClass, tableInfo);

    if (this.config.generateMapper) {
      this.generateMapper(javaClass, tableInfo, context);
    }

    if (this.config.generateService) {
      this.generateService(javaClass, tableInfo, context);
      this.generateServiceImpl(javaClass, tableInfo, context);
    }

    if (this.config.generateApi) {
      this.generateApi(javaClass, tableInfo, context);
    }

    // 生成 XML
    this.generateMapperXml(javaClass, tableInfo, context);
  }

  /**
   * 提取表信息
   */
  private extractTableInfo(javaClass: JavaClass): TableInfo {
    const tableNameAnnotation = javaClass.annotations.find(a => a.name === 'TableName');
    const tableName = tableNameAnnotation?.attributes['value'] ||
      this.camelToSnake(javaClass.className);

    return {
      tableName,
      tableComment: javaClass.classComment || javaClass.className,
    };
  }

  /**
   * 构建模板上下文
   */
  private buildTemplateContext(javaClass: JavaClass, tableInfo: TableInfo): Record<string, unknown> {
    const classNameNoSuffix = this.normalizeClassName(javaClass.className);
    return {
      className: javaClass.className,
      classNameNoSuffix,
      classNameFirstLower: this.firstLower(javaClass.className),
      classNameNoSuffixFirstLower: this.firstLower(classNameNoSuffix),
      packageName: this.config.entityPackage || javaClass.packageName,
      entityPackage: this.config.entityPackage || javaClass.packageName,
      basePackage: this.config.basePackage,
      tableInfo,
      fields: javaClass.fields,
      author: this.config.author,
      date: new Date().toISOString().split('T')[0],
      // 预计算的 XML 行
      resultMapLines: this.generateResultMapLines(javaClass.fields),
      columnListLines: this.generateColumnListLines(javaClass.fields),
    };
  }

  /**
   * 生成 Mapper 接口
   */
  private generateMapper(javaClass: JavaClass, tableInfo: TableInfo, context: Record<string, unknown>): void {
    const content = this.templateEngine.render('mapper.java.ejs', context);
    const result = this.pathResolver.resolve(
      this.config.basePackage,
      'mapper',
      `${context.classNameNoSuffix}Mapper`
    );
    this.pathResolver.writeFileIfNotExists(result.filePath, content, this.config.overwrite);
  }

  /**
   * 生成 Service 接口
   */
  private generateService(javaClass: JavaClass, tableInfo: TableInfo, context: Record<string, unknown>): void {
    const content = this.templateEngine.render('service.java.ejs', context);
    const result = this.pathResolver.resolve(
      this.config.basePackage,
      'service',
      `${context.classNameNoSuffix}Service`
    );
    this.pathResolver.writeFileIfNotExists(result.filePath, content, this.config.overwrite);
  }

  /**
   * 生成 Service 实现类
   */
  private generateServiceImpl(javaClass: JavaClass, tableInfo: TableInfo, context: Record<string, unknown>): void {
    const content = this.templateEngine.render('service-impl.java.ejs', context);
    const result = this.pathResolver.resolve(
      this.config.basePackage,
      'service-impl',
      `${context.classNameNoSuffix}ServiceImpl`
    );
    this.pathResolver.writeFileIfNotExists(result.filePath, content, this.config.overwrite);
  }

  /**
   * 生成 Api 类
   */
  private generateApi(javaClass: JavaClass, tableInfo: TableInfo, context: Record<string, unknown>): void {
    const content = this.templateEngine.render('controller.java.ejs', context);
    const result = this.pathResolver.resolve(
      this.config.basePackage,
      'api',
      `${context.classNameNoSuffix}Api`
    );
    this.pathResolver.writeFileIfNotExists(result.filePath, content, this.config.overwrite);
  }

  /**
   * 生成 Mapper XML
   */
  private generateMapperXml(javaClass: JavaClass, tableInfo: TableInfo, context: Record<string, unknown>): void {
    const content = this.templateEngine.render('mapper.xml.ejs', context);
    const result = this.pathResolver.resolve(
      this.config.basePackage,
      'mapper-xml',
      context.classNameNoSuffix as string
    );
    this.pathResolver.writeFileIfNotExists(result.filePath, content, this.config.overwrite);
  }

  /**
   * 生成 ResultMap 行
   */
  private generateResultMapLines(fields: JavaField[]): string {
    return fields.map(field => {
      const column = field.columnName || this.camelToSnake(field.fieldName);
      const property = field.fieldName;
      const javaType = this.getJavaType(field.fieldType);
      return `        <result column="${column}" property="${property}" javaType="${javaType}" />`;
    }).join('\n');
  }

  /**
   * 生成列列表行
   */
  private generateColumnListLines(fields: JavaField[]): string {
    return fields.map(field => {
      const column = field.columnName || this.camelToSnake(field.fieldName);
      return `        ${column},`;
    }).join('\n');
  }

  /**
   * 获取 Java 类型全名
   */
  private getJavaType(fieldType: string): string {
    const typeMap: Record<string, string> = {
      'String': 'java.lang.String',
      'Integer': 'java.lang.Integer',
      'Long': 'java.lang.Long',
      'Boolean': 'java.lang.Boolean',
      'Double': 'java.lang.Double',
      'Float': 'java.lang.Float',
      'BigDecimal': 'java.math.BigDecimal',
      'Date': 'java.util.Date',
      'LocalDateTime': 'java.time.LocalDateTime',
      'LocalDate': 'java.time.LocalDate',
    };
    return typeMap[fieldType] || `java.lang.${fieldType}`;
  }

  /**
   * 驼峰转蛇形
   */
  private camelToSnake(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  /**
   * 首字母小写
   */
  private firstLower(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  /**
   * 去除类名的常见后缀（如 DAO, DO, Model）
   */
  private normalizeClassName(className: string): string {
    for (const suffix of CodeGenerator.SUFFIXES_TO_REMOVE) {
      if (className.endsWith(suffix)) {
        const normalized = className.slice(0, -suffix.length);
        // 边界检查：如果去除后缀后为空，返回原始类名
        return normalized || className;
      }
    }
    return className;
  }
}

/**
 * 创建代码生成器
 */
export function createGenerator(config: GeneratorConfig): CodeGenerator {
  return new CodeGenerator(config);
}
