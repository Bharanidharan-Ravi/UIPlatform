import { TextField } from '@mui/material';

const nativeTextTypes = new Set([
  'email',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'url'
]);

export function MuiTextInput({
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
  const props = field.props || {};
  const {
    InputProps: legacyInputProps,
    inputProps: legacyHtmlInputProps,
    slotProps: providedSlotProps,
    ...restProps
  } = props;
  const inputType =
    field.inputType || (nativeTextTypes.has(field.type) ? field.type : 'text');
  const slotProps = {
    ...providedSlotProps,
    input: {
      ...(legacyInputProps || {}),
      ...(providedSlotProps?.input || {}),
      readOnly
    },
    htmlInput: {
      ...(legacyHtmlInputProps || {}),
      ...(providedSlotProps?.htmlInput || {})
    }
  };

  return (
    <TextField
      {...restProps}
      fullWidth={restProps.fullWidth ?? true}
      margin={restProps.margin ?? 'normal'}
      size={restProps.size ?? 'small'}
      type={inputType}
      label={field.label}
      name={name}
      value={value ?? ''}
      placeholder={field.placeholder}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || field.helperText}
      disabled={disabled}
      slotProps={slotProps}
    />
  );
}
