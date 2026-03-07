/**
 * Java 类结构定义
 */
export interface JavaClass {
  /** 类名 */
  className: string;
  /** 包名 */
  packageName: string;
  /** 类注释 */
  classComment?: string;
  /** 类上的注解 */
  annotations: Annotation[];
  /** 字段列表 */
  fields: JavaField[];
  /** 方法列表 */
  methods: JavaMethod[];
  /** 父类 */
  superClass?: string;
  /** 实现的接口 */
  interfaces: string[];
  /** 导入语句 */
  imports: ImportStatement[];
}

/**
 * 注解定义
 */
export interface Annotation {
  /** 注解名称 */
  name: string;
  /** 注解属性 */
  attributes: Record<string, string>;
}

/**
 * Java 字段定义
 */
export interface JavaField {
  /** 字段名 */
  fieldName: string;
  /** 字段类型 */
  fieldType: string;
  /** 字段注释 */
  comment?: string;
  /** 修饰符 */
  modifiers: string[];
  /** 注解 */
  annotations: Annotation[];
  /** 是否是主键 */
  isPrimaryKey?: boolean;
  /** 数据库列名 (如果有@TableField 注解) */
  columnName?: string;
}

/**
 * Java 方法定义
 */
export interface JavaMethod {
  /** 方法名 */
  methodName: string;
  /** 返回类型 */
  returnType: string;
  /** 方法注释 */
  comment?: string;
  /** 参数列表 */
  parameters: MethodParameter[];
  /** 修饰符 */
  modifiers: string[];
  /** 注解 */
  annotations: Annotation[];
}

/**
 * 方法参数定义
 */
export interface MethodParameter {
  /** 参数名 */
  paramName: string;
  /** 参数类型 */
  paramType: string;
  /** 注解 */
  annotations: Annotation[];
}

/**
 * 导入语句
 */
export interface ImportStatement {
  /** 完整类名 */
  className: string;
  /** 是否静态导入 */
  isStatic: boolean;
}

/**
 * 表信息
 */
export interface TableInfo {
  /** 表名 */
  tableName: string;
  /** 表注释 */
  tableComment?: string;
}
