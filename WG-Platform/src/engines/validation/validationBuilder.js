export function buildValidationSchema(fields = []) {
  return fields.reduce((rules, field) => {
    if (!field?.name) {
      return rules;
    }

    const nextRule = {
      ...(field.validation || {})
    };

    if (field.required) {
      nextRule.required =
        typeof field.required === 'string' ? field.required : 'Required';
    }

    ['min', 'max', 'minLength', 'maxLength', 'pattern'].forEach((key) => {
      if (field[key] !== undefined) {
        nextRule[key] = field[key];
      }
    });

    if (typeof field.validate === 'function') {
      nextRule.validate = field.validate;
    }

    if (Object.keys(nextRule).length > 0) {
      rules[field.name] = nextRule;
    }

    return rules;
  }, {});
}
