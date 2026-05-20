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
  const {
    InputProps: legacyInputProps,
    InputLabelProps: legacyInputLabelProps,
    inputProps: legacyHtmlInputProps,
    slotProps: providedSlotProps,
    ...restProps
  } = props;
  const slotProps = {
    ...providedSlotProps,
    input: {
      ...(legacyInputProps || {}),
      ...(providedSlotProps?.input || {}),
      readOnly
    },
    inputLabel: {
      ...(legacyInputLabelProps || {}),
      ...(providedSlotProps?.inputLabel || {}),
      shrink: true
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
      type="date"
      label={field.label}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || field.helperText}
      disabled={disabled}
      slotProps={slotProps}
    />
  );
}
