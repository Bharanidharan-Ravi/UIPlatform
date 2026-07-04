// Inside: UIPlatform/WG-Platform/src/components/FormikConfigEngine.jsx
import React from "react";
import { Formik, Form } from "formik";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  FormHelperText,
  Box,
} from "@mui/material";
import buildYupSchemaFromConfig from "../validation/yupSchemaBuilder.js";
import { getValueByPath, mapInitialValues } from "../utils/valueMapper.js";

function evaluateDepends(dependsOn, values) {
  if (!dependsOn) return { visible: true, disabled: false };
  const {
    field: depField,
    value: expectedValue,
    operator = "equals",
    action = "show",
  } = dependsOn;
  const current = getValueByPath(values, depField);

  let match = false;

  switch (operator) {
    case "equals":
    case "==":
      match = current === expectedValue;
      break;
    case "notEquals":
    case "!=":
      match = current !== expectedValue;
      break;
    case "in":
      match = Array.isArray(expectedValue) && expectedValue.includes(current);
      break;
    case "notIn":
      match = Array.isArray(expectedValue) && !expectedValue.includes(current);
      break;
    case "includes":
    case "contains":
      if (typeof current === "string")
        match = String(current).includes(String(expectedValue));
      else if (Array.isArray(current)) match = current.includes(expectedValue);
      break;
    case "gt":
    case ">":
      match = Number(current) > Number(expectedValue);
      break;
    case "gte":
    case ">=":
      match = Number(current) >= Number(expectedValue);
      break;
    case "lt":
    case "<":
      match = Number(current) < Number(expectedValue);
      break;
    case "lte":
    case "<=":
      match = Number(current) <= Number(expectedValue);
      break;
    case "regex": {
      try {
        const re =
          typeof expectedValue === "string"
            ? new RegExp(expectedValue)
            : expectedValue;
        match = re.test(String(current || ""));
      } catch (e) {
        match = false;
      }
      break;
    }
    default:
      match = current === expectedValue;
  }

  if (action === "show") return { visible: Boolean(match), disabled: false };
  if (action === "hide") return { visible: !match, disabled: false };
  if (action === "disable") return { visible: true, disabled: Boolean(match) };

  return { visible: true, disabled: false };
}

function normalizeOptions(options = []) {
  return options.map((o) =>
    typeof o === "object" ? o : { label: String(o), value: o },
  );
}

export function FormikConfigEngine({
  config = {},
  onSubmit,
  submitLabel = "Submit",
  showDebug = false,
  buttonProps = {},
  fieldProps = {},
}) {
  const { fields = [], initialValues: initialCfg = {} } = config;

  // FIX: Merge field-level schema default values into Formik's base initial state setup
  const initialValues = React.useMemo(() => {
    const baseValues = Object.keys(initialCfg).length
      ? { ...initialCfg }
      : mapInitialValues(fields, {});

    // Walk through each layout field definition rule
    fields.forEach((field) => {
      if (field?.name && field.defaultValue !== undefined) {
        const currentVal = baseValues[field.name];
        // If it's undefined, null, or has been scaffolded as an empty string ("")
        if (currentVal === undefined || currentVal === null || currentVal === "") {
          baseValues[field.name] = field.defaultValue;
        }
      }
    });

    return baseValues;
  }, [initialCfg, fields]);

  const cfgValidation = config.validationSchema;
  let validationSchema;

  if (cfgValidation) {
    if (
      typeof cfgValidation === "object" &&
      typeof cfgValidation.validate === "function"
    ) {
      validationSchema = cfgValidation;
    } else if (typeof cfgValidation === "function") {
      validationSchema = cfgValidation(fields);
    } else if (
      typeof cfgValidation === "object" &&
      Array.isArray(cfgValidation.fields)
    ) {
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
      onSubmit={(values, actions) => onSubmit?.(values, actions)}
    >
      {(formik) => (
        <Form noValidate style={{ width: "100%" }}>
          {fields.map((field) => {
            if (!field?.name) return null;

            const { visible, disabled: dependsDisabled } = evaluateDepends(
              field.dependsOn,
              formik.values,
            );
            if (!visible) return null;

            const disabled =
              Boolean(field.disabled) || Boolean(dependsDisabled);
            
            // Reference the evaluated form state value accurately
            const value = getValueByPath(formik.values, field.name) ?? field.defaultValue ?? "";
            
            const error = getValueByPath(formik.errors, field.name);
            const touched = getValueByPath(formik.touched, field.name);
            const showError = Boolean(touched && error);

            const commonProps = {
              fullWidth: true,
              margin: "normal",
              variant: "outlined",
              ...fieldProps,
            };

            switch ((field.type || "text").toLowerCase()) {
              case "select": {
                const opts = normalizeOptions(field.options || []);
                return (
                  <TextField
                    key={field.name}
                    select
                    label={field.label}
                    name={field.name}
                    value={value}
                    onChange={(e) =>
                      formik.setFieldValue(field.name, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    error={showError}
                    helperText={showError ? error : field.helperText}
                    {...commonProps}
                  >
                    {opts.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }
              default: {
                const type = (field.type || "text").toLowerCase();
                const inputType =
                  type === "password" ||
                  type === "email" ||
                  type === "date" ||
                  type === "time"
                    ? type
                    : "text";
                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={inputType}
                    value={value}
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

          <Box mt={3} width="100%">
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={formik.isSubmitting}
              sx={{
                height: '48px',
                borderRadius: '50px', 
                textTransform: 'none',
                fontSize: '16px',
                fontFamily: 'inherit',
                fontWeight: 600,
                backgroundColor: '#1d2274',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: '#151955' },
                '&.Mui-disabled': {
                  backgroundColor: '#1d2274',
                  opacity: 0.7,
                  color: '#ffffff'
                }
              }}
            >
              {formik.isSubmitting && (
                <svg 
                  className="animate-spin" 
                  viewBox="0 0 24 24" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    animation: 'spin 1s linear infinite',
                    color: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path 
                    className="opacity-90" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{submitLabel}</span>
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default FormikConfigEngine;