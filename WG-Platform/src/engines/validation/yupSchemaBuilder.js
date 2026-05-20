import * as yup from 'yup';

export function buildYupSchemaFromConfig(fields = []) {
  const shape = {};

  fields.forEach((field) => {
    const name = field?.name;
    if (!name) return;
    const v = field.validation || {};
    const type = (field.type || 'text').toLowerCase();

    let schema;

    if (type === 'number' || v.numberOnly || v.number) {
      schema = yup
        .number()
        .transform((value, originalValue) => {
          if (originalValue === '' || originalValue === null || originalValue === undefined) {
            return undefined;
          }
          return Number(originalValue);
        })
        .typeError(v.typeMessage || 'Must be a number');

      if (v.min !== undefined) schema = schema.min(v.min, v.minMessage || `Must be at least ${v.min}`);
      if (v.max !== undefined) schema = schema.max(v.max, v.maxMessage || `Must be at most ${v.max}`);
    } else {
      schema = yup.string();

      if (type === 'email') schema = schema.email(v.emailMessage || 'Must be a valid email');
      if (v.textOnly) schema = schema.matches(/^[A-Za-z\s]+$/, v.textOnlyMessage || 'Only letters allowed');
      if (v.minLength !== undefined) schema = schema.min(v.minLength, v.minLengthMessage || `Must be at least ${v.minLength} characters`);
      if (v.maxLength !== undefined) schema = schema.max(v.maxLength, v.maxLengthMessage || `Must be ${v.maxLength} characters or fewer`);

      const pattern = v.pattern || field.customValidation;
      if (pattern) {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        schema = schema.matches(regex, v.patternMessage || 'Invalid format');
      }
    }

    if (v.required || field.required) {
      schema = schema.required(v.requiredMessage || 'Required');
    }

    shape[name] = schema;
  });

  return yup.object().shape(shape);
}

export default buildYupSchemaFromConfig;
