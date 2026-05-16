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
  const inputType =
    field.inputType || (nativeTextTypes.has(field.type) ? field.type : 'text');

  return (
    <TextField
      {...props}
      fullWidth={props.fullWidth ?? true}
      margin={props.margin ?? 'normal'}
      size={props.size ?? 'small'}
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
      InputProps={{
        ...(props.InputProps || {}),
        readOnly
      }}
    />
  );
}
