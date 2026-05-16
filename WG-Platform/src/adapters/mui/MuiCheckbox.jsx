import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

export function MuiCheckbox({
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
          <Checkbox
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
