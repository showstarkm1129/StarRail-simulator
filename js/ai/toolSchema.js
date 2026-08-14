// toolSchema.js — AIプロバイダーに依存しない最小JSON Schema引数検証

export function validateToolSchema(value, schema, path = '$') {
    const errors = [];
    if (!schema) return errors;
    const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    const typeMatches = schema.type === 'integer'
        ? type === 'number' && Number.isInteger(value)
        : !schema.type || type === schema.type;
    if (!typeMatches) {
        errors.push({ path, code: 'TYPE_MISMATCH', message: `${schema.type} が必要です。`, actual: type });
        return errors;
    }
    if (schema.enum && !schema.enum.includes(value)) {
        errors.push({ path, code: 'ENUM_MISMATCH', message: '許可されていない値です。' });
    }
    if (type === 'number' && schema.minimum !== undefined && value < schema.minimum) {
        errors.push({ path, code: 'MINIMUM', message: `${schema.minimum} 以上が必要です。` });
    }
    if (type === 'number' && schema.maximum !== undefined && value > schema.maximum) {
        errors.push({ path, code: 'MAXIMUM', message: `${schema.maximum} 以下が必要です。` });
    }
    if (type === 'object') {
        for (const required of schema.required || []) {
            if (!(required in value)) errors.push({ path: `${path}.${required}`, code: 'REQUIRED', message: '必須項目です。' });
        }
        if (schema.additionalProperties === false) {
            for (const key of Object.keys(value)) {
                if (!schema.properties?.[key]) errors.push({ path: `${path}.${key}`, code: 'ADDITIONAL_PROPERTY', message: '未定義の項目です。' });
            }
        }
        for (const [key, item] of Object.entries(value)) {
            if (schema.properties?.[key]) errors.push(...validateToolSchema(item, schema.properties[key], `${path}.${key}`));
        }
    }
    if (type === 'array' && schema.items) {
        value.forEach((item, index) => errors.push(...validateToolSchema(item, schema.items, `${path}.${index}`)));
    }
    return errors;
}
