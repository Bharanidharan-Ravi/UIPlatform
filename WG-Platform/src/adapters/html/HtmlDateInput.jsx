export function HtmlDateInput({
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
  return (
    <label>
      {field.label}
      <input
        {...(field.props || {})}
        type="date"
        name={name}
        value={value ?? ''}
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
