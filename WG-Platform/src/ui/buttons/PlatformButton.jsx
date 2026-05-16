import { Button } from '@mui/material';

export function PlatformButton({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  ...props
}) {
  return (
    <Button variant={variant} color={color} size={size} {...props}>
      {children}
    </Button>
  );
}
