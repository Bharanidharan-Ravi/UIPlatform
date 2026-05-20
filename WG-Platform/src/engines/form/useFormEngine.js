import { useCallback, useMemo, useState } from 'react';
import { FORM, platformLog, VALIDATION } from '../../debug/index.js';
import { createValidationResolver } from '../validation/validationResolver.js';
import {
  getValueByPath,
  mapFormValues,
  mapInitialValues,
  normalizeInputValue,
  setValueByPath
} from './valueMapper.js';

const hasErrors = (errors) => Object.keys(errors || {}).length > 0;
const shouldRedactFieldValue = (name) =>
  /password|token|authorization|secret|apikey/i.test(String(name || ''));

export function useFormEngine({
  schema = [],
  value,
  defaultValue = {},
  onChange,
  onSubmit,
  validation,
  resolver,
  valueMapper
} = {}) {
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useState(() =>
    mapInitialValues(schema, defaultValue)
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const values = isControlled ? value : internalValues;
  const validationRules = useMemo(
    () => validation || schema,
    [schema, validation]
  );
  const resolveValidation = useMemo(
    () => resolver || createValidationResolver(validationRules),
    [resolver, validationRules]
  );

  const updateValues = useCallback(
    (nextValues) => {
      if (!isControlled) {
        setInternalValues(nextValues);
      }

      onChange?.(nextValues);
    },
    [isControlled, onChange]
  );

  const setFieldValue = useCallback(
    (name, input) => {
      const nextValue = normalizeInputValue(input);

      platformLog(FORM, 'Field changed', {
        name,
        value: shouldRedactFieldValue(name) ? '[REDACTED]' : nextValue
      });

      const nextValues = setValueByPath(
        values,
        name,
        nextValue
      );
      updateValues(nextValues);

      // Clear error for this field when value changes
      setErrors((current) => {
        if (current[name]) {
          const nextErrors = { ...current };
          delete nextErrors[name];
          return nextErrors;
        }
        return current;
      });

      return nextValues;
    },
    [updateValues, values]
  );

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((current) => ({ ...current, [name]: isTouched }));
  }, []);

  const validate = useCallback(
    (nextValues = values) => {
      const nextErrors = resolveValidation(nextValues, { schema }) || {};
      const valid = !hasErrors(nextErrors);

      setErrors(nextErrors);

      platformLog(VALIDATION, 'Validation result', {
        valid,
        errors: nextErrors
      });

      return {
        valid,
        errors: nextErrors
      };
    },
    [resolveValidation, schema, values]
  );

  const reset = useCallback(
    (nextValue = defaultValue) => {
      const nextValues = mapInitialValues(schema, nextValue);
      setErrors({});
      setTouched({});
      updateValues(nextValues);
      return nextValues;
    },
    [defaultValue, schema, updateValues]
  );

  const handleSubmit = useCallback(
    (event) => {
      event?.preventDefault?.();

      const result = validate(values);

      platformLog(FORM, 'Submit attempted', {
        valid: result.valid
      });

      if (result.valid) {
        onSubmit?.(mapFormValues(values, schema, valueMapper), result);
      }

      return result;
    },
    [onSubmit, schema, validate, valueMapper, values]
  );

  const getFieldProps = useCallback(
    (field) => {
      const name = field.name;

      return {
        name,
        value: getValueByPath(values, name, field.defaultValue ?? ''),
        error: Boolean(errors[name]),
        helperText: errors[name],
        touched: Boolean(touched[name]),
        onChange: (nextValue) => {
          setFieldValue(name, nextValue);
        },
        onBlur: () => setFieldTouched(name, true)
      };
    },
    [errors, setFieldTouched, setFieldValue, touched, values]
  );

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    getFieldProps,
    validate,
    reset,
    handleSubmit
  };
}
