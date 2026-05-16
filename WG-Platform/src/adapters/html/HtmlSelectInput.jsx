const normalizeOption = (option) =>
  typeof option === 'object'
    ? option
    : {
        label: option,
        value: option
      };

export function HtmlSelectInput({
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
      <select
        {...(field.props || {})}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || readOnly}
        aria-invalid={error || undefined}
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
      {error || helperText || field.helperText ? (
        <span role={error ? 'alert' : undefined}>
          {helperText || field.helperText}
        </span>
      ) : null}
    </label>
  );
}
