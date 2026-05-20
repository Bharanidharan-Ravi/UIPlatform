import { Box, CircularProgress } from '@mui/material';

export function PlatformLoader({
  label = 'Loading',
  size = 32,
  sx,
  display,
  alignItems,
  justifyContent,
  flexDirection,
  gap,
  ...props
}) {
  return (
    <Box
      role="status"
      sx={{
        alignItems: alignItems ?? 'center',
        display: display ?? 'flex',
        flexDirection,
        gap: gap ?? 1.5,
        justifyContent: justifyContent ?? 'center',
        ...sx
      }}
      {...props}
    >
      <CircularProgress size={size} />
      <span>{label}</span>
    </Box>
  );
}
