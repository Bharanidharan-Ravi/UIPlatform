import { MenuItem, TextField } from '@mui/material';

const normalizeOption = (option) =>
  typeof option === 'object'
    ? option
    : {
        label: option,
        value: option
      };

export function MuiSelectInput({
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
  const options = field.options || [];

  return (
    <TextField
      {...props}
      select
      fullWidth={props.fullWidth ?? true}
      margin={props.margin ?? 'normal'}
      size={props.size ?? 'small'}
      label={field.label}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText || field.helperText}
      disabled={disabled || readOnly}
    >
      {field.placeholder ? (
        <MenuItem value="" disabled>
          {field.placeholder}
        </MenuItem>
      ) : null}

      {options.map((option) => {
        const normalized = normalizeOption(option);

        return (
          <MenuItem
            key={String(normalized.value)}
            value={normalized.value}
            disabled={normalized.disabled}
          >
            {normalized.label}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
