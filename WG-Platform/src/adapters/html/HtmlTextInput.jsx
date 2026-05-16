export function HtmlTextInput({
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

  return (
    <label>
      {field.label}
      <input
        {...(field.props || {})}
        type={inputType}
        name={name}
        value={value ?? ''}
        placeholder={field.placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error || undefined}
      />
      {error || helperText || field.helperText ? (
        <span role={error ? 'alert' : undefined}>
          {helperText || field.helperText}
        </span>
      ) : null}
    </label>
  );
}
