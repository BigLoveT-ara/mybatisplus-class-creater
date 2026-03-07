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
export declare class TemplateEngine {
    /** 默认模板目录 */
    private static readonly DEFAULT_TEMPLATES_DIR;
    private templatesDir;
    private cache;
    /**
     * 创建模板引擎
     * @param templatesDir 模板目录（可选，默认使用项目根目录的 templates/）
     */
    constructor(templatesDir?: string);
    /**
     * 渲染模板
     * @param templateName 模板名称（如 'mapper.java.ejs'）
     * @param context 模板上下文数据
     * @returns 渲染后的字符串
     */
    render(templateName: string, context: TemplateContext): string;
    /**
     * 加载模板文件
     */
    private loadTemplate;
    /**
     * 编译并渲染模板
     */
    private compile;
    /**
     * 解析对象路径
     * 如 resolvePath({ a: { b: 'c' } }, 'a.b') => 'c'
     */
    private resolvePath;
    /**
     * 清除缓存
     */
    clearCache(): void;
    /**
     * 获取默认模板目录
     */
    static getDefaultTemplatesDir(): string;
}
//# sourceMappingURL=TemplateEngine.d.ts.map