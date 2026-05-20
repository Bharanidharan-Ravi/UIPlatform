import React from 'react';
import { Formik, Form } from 'formik';
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  FormHelperText,
  Box
} from '@mui/material';
import buildYupSchemaFromConfig from '../validation/yupSchemaBuilder.js';
import { getValueByPath, mapInitialValues } from './valueMapper.js';

function evaluateDepends(dependsOn, values) {
  if (!dependsOn) return { visible: true, disabled: false };
  const { field: depField, value: expectedValue, operator = 'equals', action = 'show' } = dependsOn;
  const current = getValueByPath(values, depField);

  let match = false;

  switch (operator) {
    case 'equals':
    case '==':
      match = current === expectedValue;
      break;
    case 'notEquals':
    case '!=':
      match = current !== expectedValue;
      break;
    case 'in':
      match = Array.isArray(expectedValue) && expectedValue.includes(current);
      break;
    case 'notIn':
      match = Array.isArray(expectedValue) && !expectedValue.includes(current);
      break;
    case 'includes':
    case 'contains':
      if (typeof current === 'string') match = String(current).includes(String(expectedValue));
      else if (Array.isArray(current)) match = current.includes(expectedValue);
      break;
    case 'gt':
    case '>':
      match = Number(current) > Number(expectedValue);
      break;
    case 'gte':
    case '>=':
      match = Number(current) >= Number(expectedValue);
      break;
    case 'lt':
    case '<':
      match = Number(current) < Number(expectedValue);
      break;
    case 'lte':
    case '<=':
      match = Number(current) <= Number(expectedValue);
      break;
    case 'regex': {
      try {
        const re = typeof expectedValue === 'string' ? new RegExp(expectedValue) : expectedValue;
        match = re.test(String(current || ''));
      } catch (e) {
        match = false;
      }
      break;
    }
    default:
      match = current === expectedValue;
  }

  if (action === 'show') return { visible: Boolean(match), disabled: false };
  if (action === 'hide') return { visible: !match, disabled: false };
  if (action === 'disable') return { visible: true, disabled: Boolean(match) };

  return { visible: true, disabled: false };
}

function normalizeOptions(options = []) {
  return options.map((o) => (typeof o === 'object' ? o : { label: String(o), value: o }));
}

export function FormikConfigEngine({ config = {}, onSubmit, submitLabel = 'Submit', showDebug = false }) {
  const { fields = [], initialValues: initialCfg = {} } = config;

  const initialValues = Object.keys(initialCfg).length
    ? initialCfg
    : mapInitialValues(fields, {});

  // Support top-level `validationSchema` on the config. It may be:
  // - a Yup schema instance
  // - a factory function that returns a schema when given `fields`
  // - an object like { fields: [...] } which will be passed to the builder
  const cfgValidation = config.validationSchema;
  let validationSchema;

  if (cfgValidation) {
    if (typeof cfgValidation === 'object' && typeof cfgValidation.validate === 'function') {
      validationSchema = cfgValidation; // already a Yup schema
    } else if (typeof cfgValidation === 'function') {
      validationSchema = cfgValidation(fields);
    } else if (typeof cfgValidation === 'object' && Array.isArray(cfgValidation.fields)) {
      validationSchema = buildYupSchemaFromConfig(cfgValidation.fields);
    } else {
      validationSchema = buildYupSchemaFromConfig(fields);
    }
  } else {
    validationSchema = buildYupSchemaFromConfig(fields);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, actions) => {
        onSubmit?.(values, actions);
      }}
    >
      {(formik) => (
        <Form noValidate>
          {fields.map((field) => {
            if (!field?.name) return null;

            const { visible, disabled: dependsDisabled } = evaluateDepends(field.dependsOn, formik.values);
            if (!visible) return null;

            const disabled = Boolean(field.disabled) || Boolean(dependsDisabled);
            const value = getValueByPath(formik.values, field.name, field.defaultValue ?? '');
            const error = getValueByPath(formik.errors, field.name);
            const touched = getValueByPath(formik.touched, field.name);
            const showError = Boolean(touched && error);

            const commonProps = {
              fullWidth: true,
              margin: 'normal',
              variant: 'outlined'
            };

            switch ((field.type || 'text').toLowerCase()) {
              case 'select': {
                const opts = normalizeOptions(field.options || []);
                return (
                  <TextField
                    key={field.name}
                    select
                    label={field.label}
                    name={field.name}
                    value={value ?? ''}
                    onChange={(e) => formik.setFieldValue(field.name, e.target.value)}
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    error={showError}
                    helperText={showError ? error : field.helperText}
                    {...commonProps}
                  >
                    {field.placeholder ? (
                      <MenuItem value="" disabled>
                        {field.placeholder}
                      </MenuItem>
                    ) : null}
                    {opts.map((opt) => (
                      <MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }

              case 'checkbox': {
                return (
                  <Box key={field.name} marginY={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={field.name}
                          checked={Boolean(value)}
                          onChange={(e) => formik.setFieldValue(field.name, e.target.checked)}
                          onBlur={formik.handleBlur}
                          disabled={disabled}
                        />
                      }
                      label={field.label}
                    />
                    {showError ? <FormHelperText error>{error}</FormHelperText> : field.helperText ? <FormHelperText>{field.helperText}</FormHelperText> : null}
                  </Box>
                );
              }

              case 'number': {
                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      formik.setFieldValue(field.name, v === '' ? '' : Number(v));
                    }}
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    error={showError}
                    helperText={showError ? error : field.helperText}
                    {...commonProps}
                  />
                );
              }

              default: {
                // text, email, password, date, time
                const type = (field.type || 'text').toLowerCase();
                const inputType = type === 'password' || type === 'email' || type === 'date' || type === 'time' ? type : 'text';
                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={inputType}
                    value={value ?? ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    error={showError}
                    helperText={showError ? error : field.helperText}
                    {...commonProps}
                  />
                );
              }
            }
          })}

          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {submitLabel}
            </Button>
          </Box>

          {showDebug ? <pre style={{ marginTop: 12 }}>{JSON.stringify({ values: formik.values, errors: formik.errors, touched: formik.touched }, null, 2)}</pre> : null}
        </Form>
      )}
    </Formik>
  );
}

export default FormikConfigEngine;
