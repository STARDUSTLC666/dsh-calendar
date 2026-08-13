/**
 * 工具参数 DSL 编译：把作者友好的参数描述编译成注册所需的【编译好的 JSON Schema】。
 *
 * 这是社区插件必须遵守的坑：ctx.tools.register 的 parameters 字段必须是
 * { type: 'object', properties: {...}, required?: [...] } 形式的 JSON Schema，
 * 绝不能塞原始 DSL（{ summary: { type: 'string' } } 这种），否则标准模式下 DeepSeek
 * API 会以 "schema must be a JSON Schema of 'type: object'" 拒绝请求。
 *
 * @module dsh-calendar/parameters
 */
/** 单个参数属性支持的类型。 */
export type ParameterType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
/** 单个参数属性的 DSL 描述。 */
export interface ParameterSpec {
    type: ParameterType;
    /** 是否为必填参数；编译进顶层 required 数组。 */
    required?: boolean;
    /** 人类可读描述，投影进 JSON Schema 的 description 注解。 */
    description?: string;
    /** 可选枚举约束（标量类型）。 */
    enum?: readonly (string | number | boolean)[];
    /** 数组元素的类型（type: 'array' 时生效）。 */
    items?: Exclude<ParameterType, 'array' | 'object'>;
}
/** 参数 DSL 映射：键为参数名，值为属性描述。 */
export type ParameterDsl = Record<string, ParameterSpec>;
/** 编译后的 JSON Schema（object 根）。 */
export interface CompiledParameters {
    type: 'object';
    properties: Record<string, Record<string, unknown>>;
    required?: string[];
}
/**
 * 把参数 DSL 编译成注册用的 JSON Schema。
 * @param dsl - 参数描述映射。
 * @returns 以 object 为根的编译后 schema。
 */
export declare function compileParameters(dsl: ParameterDsl): CompiledParameters;
