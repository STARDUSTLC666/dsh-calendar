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
/**
 * 把参数 DSL 编译成注册用的 JSON Schema。
 * @param dsl - 参数描述映射。
 * @returns 以 object 为根的编译后 schema。
 */
export function compileParameters(dsl) {
    const properties = {};
    const required = [];
    for (const [name, spec] of Object.entries(dsl)) {
        const property = { type: spec.type };
        if (spec.enum !== undefined)
            property.enum = [...spec.enum];
        if (spec.description !== undefined)
            property.description = spec.description;
        if (spec.type === 'array' && spec.items !== undefined) {
            property.items = { type: spec.items };
        }
        properties[name] = property;
        if (spec.required === true)
            required.push(name);
    }
    const schema = { type: 'object', properties };
    if (required.length > 0)
        schema.required = required;
    return schema;
}
