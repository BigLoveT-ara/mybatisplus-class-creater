import * as fs from 'fs';
import * as path from 'path';
/**
 * Java 代码解析器
 */
export class JavaParser {
    content;
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
        this.content = fs.readFileSync(filePath, 'utf-8');
    }
    /**
     * 解析 Java 文件
     */
    parse() {
        const packageName = this.extractPackageName();
        const imports = this.extractImports();
        const className = this.extractClassName();
        const classComment = this.extractClassComment();
        const annotations = this.extractClassAnnotations();
        const superClass = this.extractSuperClass();
        const interfaces = this.extractInterfaces();
        const fields = this.extractFields();
        const methods = this.extractMethods();
        return {
            className,
            packageName,
            classComment,
            annotations,
            fields,
            methods,
            superClass,
            interfaces,
            imports,
        };
    }
    /**
     * 提取包名
     */
    extractPackageName() {
        const match = this.content.match(/package\s+([\w.]+)\s*;/);
        return match ? match[1] : '';
    }
    /**
     * 提取导入语句
     */
    extractImports() {
        const imports = [];
        const importRegex = /import\s+(static\s+)?([\w.$]+)\s*;/g;
        let match;
        while ((match = importRegex.exec(this.content)) !== null) {
            imports.push({
                className: match[2],
                isStatic: !!match[1],
            });
        }
        return imports;
    }
    /**
     * 提取类名
     */
    extractClassName() {
        const match = this.content.match(/(?:public\s+)?(?:abstract\s+)?(?:final\s+)?(?:@[\w\s(),=<>".\[\]]+\s+)*class\s+(\w+)/);
        return match ? match[1] : '';
    }
    /**
     * 提取类注释
     */
    extractClassComment() {
        // 先找到类定义的位置
        const classMatch = this.content.match(/\/\*\*([\s\S]*?)\*\/\s*(?:@[\w\s(),=<>".\[\]]+\s+)*public\s+class\s+\w+/);
        if (classMatch) {
            return this.cleanComment('/**' + classMatch[1] + '*/');
        }
        return undefined;
    }
    /**
     * 提取类注解
     */
    extractClassAnnotations() {
        const classIndex = this.content.indexOf(' class ');
        if (classIndex === -1)
            return [];
        const beforeClass = this.content.substring(0, classIndex);
        return this.parseAnnotations(beforeClass);
    }
    /**
     * 提取父类
     */
    extractSuperClass() {
        const match = this.content.match(/extends\s+(\w+)/);
        return match ? match[1] : undefined;
    }
    /**
     * 提取实现的接口
     */
    extractInterfaces() {
        const match = this.content.match(/implements\s+([\w,\s]+)/);
        if (!match)
            return [];
        return match[1].split(',').map(i => i.trim()).filter(i => i);
    }
    /**
     * 提取字段
     */
    extractFields() {
        const fields = [];
        // 移除方法体，避免误匹配
        const contentWithoutMethods = this.removeMethodBodies();
        // 匹配字段：注解 + 修饰符 + 类型 + 字段名
        const fieldRegex = /(\/\*\*[\s\S]*?\*\/\s*)?((?:@\w+(?:\([^)]*\))?\s+)*)?(public|private|protected)?\s*(static)?\s*(final)?\s*([\w<>?,\s\[\]]+)\s+(\w+)\s*;/g;
        let match;
        while ((match = fieldRegex.exec(contentWithoutMethods)) !== null) {
            // 跳过类的定义（如果误匹配）
            if (match[7] === 'class')
                continue;
            const comment = match[1] ? this.cleanComment(match[1]) : undefined;
            const annotations = this.parseAnnotations(match[2] || '');
            const modifiers = [match[3], match[4], match[5]].filter(Boolean);
            const fieldType = match[6].trim();
            const fieldName = match[7];
            // 检查是否是主键
            const isPrimaryKey = annotations.some(a => a.name === 'TableId' || a.name === 'Id');
            // 提取列名
            let columnName;
            const tableFieldAnnotation = annotations.find(a => a.name === 'TableField');
            if (tableFieldAnnotation && tableFieldAnnotation.attributes['value']) {
                columnName = tableFieldAnnotation.attributes['value'];
            }
            fields.push({
                fieldName,
                fieldType,
                comment,
                modifiers,
                annotations,
                isPrimaryKey,
                columnName,
            });
        }
        return fields;
    }
    /**
     * 提取方法
     */
    extractMethods() {
        const methods = [];
        // 查找类体
        const classBodyStart = this.content.indexOf('{');
        if (classBodyStart === -1)
            return methods;
        const classBody = this.content.substring(classBodyStart);
        // 简化的方法匹配（处理简单情况）
        const methodRegex = /(\/\*\*[\s\S]*?\*\/\s*)?((?:@\w+(?:\([^)]*\))?\s+)*)?(public|private|protected)?\s+(static)?\s+(final)?\s+(\w+(?:<[\w,?\s]+>)?)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*\{/g;
        let match;
        while ((match = methodRegex.exec(classBody)) !== null) {
            const comment = match[1] ? this.cleanComment(match[1]) : undefined;
            const annotations = this.parseAnnotations(match[2] || '');
            const modifiers = [match[3], match[4], match[5]].filter(Boolean);
            const returnType = match[6];
            const methodName = match[7];
            const parameters = this.parseParameters(match[8] || '');
            methods.push({
                methodName,
                returnType,
                comment,
                parameters,
                modifiers,
                annotations,
            });
        }
        return methods;
    }
    /**
     * 解析方法参数
     */
    parseParameters(paramStr) {
        if (!paramStr.trim())
            return [];
        const parameters = [];
        const params = paramStr.split(',');
        for (const param of params) {
            const trimmed = param.trim();
            if (!trimmed)
                continue;
            // 处理带注解的参数
            const annotationMatch = trimmed.match(/((?:@\w+(?:\([^)]*\))?\s+)*)\s*(\w+(?:<[\w,?\s]+>)?)\s+(\w+)/);
            if (annotationMatch) {
                parameters.push({
                    paramName: annotationMatch[3],
                    paramType: annotationMatch[2],
                    annotations: this.parseAnnotations(annotationMatch[1] || ''),
                });
            }
        }
        return parameters;
    }
    /**
     * 解析注解
     */
    parseAnnotations(annotationStr) {
        const annotations = [];
        const annotationRegex = /@(\w+)(?:\(([^)]*)\))?/g;
        let match;
        while ((match = annotationRegex.exec(annotationStr)) !== null) {
            const name = match[1];
            const attributesStr = match[2] || '';
            const attributes = this.parseAnnotationAttributes(attributesStr);
            annotations.push({
                name,
                attributes,
            });
        }
        return annotations;
    }
    /**
     * 解析注解属性
     */
    parseAnnotationAttributes(attributesStr) {
        const attributes = {};
        if (!attributesStr.trim())
            return attributes;
        // 处理简单属性
        const simpleMatch = attributesStr.match(/^"([^"]*)"$/);
        if (simpleMatch) {
            attributes['value'] = simpleMatch[1];
            return attributes;
        }
        // 处理键值对
        const kvRegex = /(\w+)\s*=\s*"([^"]*)"/g;
        let match;
        while ((match = kvRegex.exec(attributesStr)) !== null) {
            attributes[match[1]] = match[2];
        }
        return attributes;
    }
    /**
     * 清理注释文本
     */
    cleanComment(commentStr) {
        return commentStr
            .replace(/\/\*\*|\*\//g, '')
            .replace(/^\s*\*\s*/gm, '')
            .split('\n')
            .filter(line => !line.trim().startsWith('@'))
            .map(line => line.trim())
            .filter(line => line)
            .shift() || '';
    }
    /**
     * 移除方法体（避免在方法内部匹配字段）
     */
    removeMethodBodies() {
        let result = '';
        let braceCount = 0;
        let inMethod = false;
        let i = 0;
        while (i < this.content.length) {
            const char = this.content[i];
            if (char === '{') {
                if (!inMethod && braceCount === 0) {
                    // 可能是类体开始
                    inMethod = true;
                }
                braceCount++;
                if (inMethod && braceCount > 1) {
                    // 在方法内部，跳过
                    i++;
                    continue;
                }
            }
            if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    inMethod = false;
                }
                if (inMethod && braceCount >= 1) {
                    i++;
                    continue;
                }
            }
            if (!inMethod || braceCount <= 1) {
                result += char;
            }
            i++;
        }
        return result;
    }
}
/**
 * 解析 Java 文件
 */
export function parseJavaFile(filePath) {
    const parser = new JavaParser(filePath);
    return parser.parse();
}
/**
 * 解析目录下的所有 Java 文件
 */
export function parseJavaDirectory(dirPath) {
    const results = [];
    function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath);
            }
            else if (file.endsWith('.java')) {
                try {
                    const javaClass = parseJavaFile(fullPath);
                    results.push(javaClass);
                }
                catch (error) {
                    console.warn(`解析文件失败：${fullPath}`, error);
                }
            }
        }
    }
    walk(dirPath);
    return results;
}
//# sourceMappingURL=JavaParser.js.map