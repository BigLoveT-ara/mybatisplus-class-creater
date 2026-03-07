import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 模板上下文接口
 */
export interface TemplateContext {
  [key: string]: unknown;
}

/**
 * 模板引擎
 *
 * 支持简单的占位符语法：
 * - `<%= variable %>` - 变量替换
 * - `<%~ array %>` - 数组展开（生成多行）
 * - `<%= object.property %>` - 对象属性访问
 */
export class TemplateEngine {
  /** 默认模板目录 */
  private static readonly DEFAULT_TEMPLATES_DIR = path.join(__dirname, '../../templates');

  private templatesDir: string;
  private cache: Map<string, string> = new Map();

  /**
   * 创建模板引擎
   * @param templatesDir 模板目录（可选，默认使用项目根目录的 templates/）
   */
  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || TemplateEngine.DEFAULT_TEMPLATES_DIR;
  }

  /**
   * 渲染模板
   * @param templateName 模板名称（如 'mapper.java.ejs'）
   * @param context 模板上下文数据
   * @returns 渲染后的字符串
   */
  render(templateName: string, context: TemplateContext): string {
    const template = this.loadTemplate(templateName);
    return this.compile(template, context);
  }

  /**
   * 加载模板文件
   */
  private loadTemplate(templateName: string): string {
    // 检查缓存
    if (this.cache.has(templateName)) {
      return this.cache.get(templateName)!;
    }

    const templatePath = path.join(this.templatesDir, templateName);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`模板文件不存在：${templatePath}`);
    }

    const content = fs.readFileSync(templatePath, 'utf-8');
    this.cache.set(templateName, content);
    return content;
  }

  /**
   * 编译并渲染模板
   */
  private compile(template: string, context: TemplateContext): string {
    let result = template;

    // 处理数组展开语法：<%~ array %>
    const arrayRegex = /<%~\s*([\w.]+)\s*%>/g;
    let match;

    while ((match = arrayRegex.exec(template)) !== null) {
      const fullMatch = match[0];
      const pathStr = match[1];
      const value = this.resolvePath(context, pathStr);

      if (Array.isArray(value)) {
        // 数组展开为多行
        const expanded = value.join('\n');
        result = result.replace(fullMatch, expanded);
      } else if (value) {
        result = result.replace(fullMatch, String(value));
      } else {
        result = result.replace(fullMatch, '');
      }
    }

    // 处理变量替换语法：<%= variable %>
    // 使用单次遍历替换所有变量，避免正则 lastIndex 问题
    result = result.replace(/<%=\s*([\w.]+)\s*%>/g, (match, pathStr) => {
      const value = this.resolvePath(context, pathStr);
      return value !== undefined && value !== null ? String(value) : '';
    });

    return result;
  }

  /**
   * 解析对象路径
   * 如 resolvePath({ a: { b: 'c' } }, 'a.b') => 'c'
   */
  private resolvePath(obj: Record<string, unknown>, pathStr: string): unknown {
    const parts = pathStr.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }

      if (typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取默认模板目录
   */
  static getDefaultTemplatesDir(): string {
    return this.DEFAULT_TEMPLATES_DIR;
  }
}
