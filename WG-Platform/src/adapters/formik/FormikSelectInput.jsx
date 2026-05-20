import { useField } from 'formik';

const normalizeOption = (option) =>
  typeof option === 'object'
    ? option
    : {
        label: option,
        value: option
      };

export function FormikSelectInput({
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
  let formikField = null;
  let meta = null;

  try {
    if (name) {
      const tuple = useField(name);
      formikField = tuple[0];
      meta = tuple[1];
    }
  } catch (e) {
    formikField = null;
    meta = null;
  }

  const hasError = Boolean(formikField ? meta?.touched && meta?.error : error);
  const displayHelper = formikField ? meta?.error : helperText || field.helperText;

  const selectProps = formikField
    ? { id: name, name, ...(field.props || {}), ...formikField }
    : { id: name, name, ...(field.props || {}), value: value ?? '', onChange, onBlur };

  return (
    <div className="formik-field">
      <label htmlFor={name} className="formik-label">
        {field.label}
      </label>
      <select
        {...selectProps}
        disabled={disabled || readOnly}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`formik-select ${hasError ? 'formik-select--error' : ''}`}
      >
        {field.placeholder ? (
          <option value="" disabled>
            {field.placeholder}
          </option>
        ) : null}
        {(field.options || []).map((option) => {
          const normalized = normalizeOption(option);

          return (
            <option
              key={String(normalized.value)}
              value={normalized.value}
              disabled={normalized.disabled}
            >
              {normalized.label}
            </option>
          );
        })}
      </select>
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
