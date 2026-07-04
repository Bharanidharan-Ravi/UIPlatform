import { useField } from 'formik';

export function FormikTextInput({
  field,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
  readOnly
}) {
  const inputType = field.inputType || field.type || 'text';

  let formikField = null;
  let meta = null;

  try {
    if (name) {
      const tuple = useField(name);
      formikField = tuple[0];
      meta = tuple[1];
    }
  } catch (e) {
    // Not inside Formik context
    formikField = null;
    meta = null;
  }

  const hasError = Boolean(formikField ? meta?.touched && meta?.error : error);
  const displayHelper = formikField ? meta?.error : helperText || field.helperText;

  // FIX: Resolve value prioritizing Formik State -> Passed Value Prop -> Schema Default -> Fallback Empty String
  const resolvedValue = formikField?.value ?? value ?? field.defaultValue ?? '';
console.log("field L:", field, resolvedValue);

  const inputProps = formikField
    ? { 
        id: name, 
        name, 
        ...(field.props || {}), 
        ...formikField, 
        value: resolvedValue // Force resolved value to override undefined formik context states
      }
    : { 
        id: name, 
        name, 
        ...(field.props || {}), 
        value: resolvedValue, 
        onChange, 
        onBlur 
      };

  return (
    <div className="formik-field">
      <label htmlFor={name} className="formik-label">
        {field.label}
      </label>
      <input
        {...inputProps}
        type={inputType}
        placeholder={field.placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`formik-input ${hasError ? 'formik-input--error' : ''}`}
      />
      {hasError || displayHelper ? (
        <span
          id={hasError ? `${name}-error` : undefined}
          role={hasError ? 'alert' : undefined}
          className="formik-helper-text"
        >
          {displayHelper}
        </span>
      ) : null}
    </div>
  );
}