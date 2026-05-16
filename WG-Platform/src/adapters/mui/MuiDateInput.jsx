import { TextField } from '@mui/material';

export function MuiDateInput({
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

  return (
    <TextField
      {...props}
      fullWidth={props.fullWidth ?? true}
      margin={props.margin ?? 'normal'}
      size={props.size ?? 'small'}
      type="date"
      label={field.label}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || field.helperText}
      disabled={disabled}
      InputLabelProps={{
        ...(props.InputLabelProps || {}),
        shrink: true
      }}
      InputProps={{
        ...(props.InputProps || {}),
        readOnly
      }}
    />
  );
}
