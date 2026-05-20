import { getValueByPath } from '../utils/valueMapper.js';
import { buildValidationSchema } from './validationBuilder.js';

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

const getMessage = (ruleValue, fallback) =>
  typeof ruleValue === 'string' ? ruleValue : fallback;

function validateRule(value, rule, values, context) {
  if (rule.required && isEmpty(value)) {
    return getMessage(rule.required, 'Required');
  }

  if (rule.min !== undefined && Number(value) < Number(rule.min)) {
    return getMessage(rule.minMessage, `Must be at least ${rule.min}`);
  }

  if (rule.max !== undefined && Number(value) > Number(rule.max)) {
    return getMessage(rule.maxMessage, `Must be at most ${rule.max}`);
  }

  if (rule.minLength !== undefined && String(value || '').length < rule.minLength) {
    return getMessage(
      rule.minLengthMessage,
      `Must be at least ${rule.minLength} characters`
    );
  }

  if (rule.maxLength !== undefined && String(value || '').length > rule.maxLength) {
    return getMessage(
      rule.maxLengthMessage,
      `Must be ${rule.maxLength} characters or fewer`
    );
  }

  if (rule.pattern && !new RegExp(rule.pattern).test(String(value || ''))) {
    return getMessage(rule.patternMessage, 'Invalid format');
  }

  if (typeof rule.validate === 'function') {
    const result = rule.validate(value, values, context);
    return result === true ? undefined : result;
  }

  return undefined;
}

export function resolveValidation(values = {}, rules = {}, context = {}) {
  return Object.entries(rules).reduce((errors, [name, rule]) => {
    const value = getValueByPath(values, name);
    const error = validateRule(value, rule, values, context);

    if (error) {
      errors[name] = error;
    }

    return errors;
  }, {});
}

export function createValidationResolver(schemaOrRules = {}) {
  const rules = Array.isArray(schemaOrRules)
    ? buildValidationSchema(schemaOrRules)
    : schemaOrRules;

  return (values, context) => resolveValidation(values, rules, context);
}
