import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel
} from '@mui/material';

const normalizeOption = (option) =>
  typeof option === 'object'
    ? option
    : {
        label: option,
        value: option
      };

export function MuiGroupInput({
  field,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
  readOnly
}) {
  const selectedValues = Array.isArray(value) ? value : [];
  const options = field.options || [];

  const toggleValue = (optionValue) => {
    const nextValue = selectedValues.includes(optionValue)
      ? selectedValues.filter((entry) => entry !== optionValue)
      : [...selectedValues, optionValue];

    onChange(nextValue);
  };

  return (
    <FormControl component="fieldset" error={error} disabled={disabled || readOnly}>
      {field.label ? <FormLabel component="legend">{field.label}</FormLabel> : null}
      <FormGroup>
        {options.map((option) => {
          const normalized = normalizeOption(option);

          return (
            <FormControlLabel
              key={String(normalized.value)}
              control={
                <Checkbox
                  checked={selectedValues.includes(normalized.value)}
                  onChange={() => toggleValue(normalized.value)}
                  onBlur={onBlur}
                />
              }
              label={normalized.label}
              disabled={normalized.disabled}
            />
          );
        })}
      </FormGroup>
      {error || helperText || field.helperText ? (
        <FormHelperText>{helperText || field.helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
