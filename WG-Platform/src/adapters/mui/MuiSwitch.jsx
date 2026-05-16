import { FormControlLabel, FormHelperText, Switch } from '@mui/material';

export function MuiSwitch({
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
    <>
      <FormControlLabel
        control={
          <Switch
            {...props}
            name={name}
            checked={Boolean(value)}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled || readOnly}
          />
        }
        label={field.label}
      />
      {error || helperText || field.helperText ? (
        <FormHelperText error={error}>
          {helperText || field.helperText}
        </FormHelperText>
      ) : null}
    </>
  );
}
