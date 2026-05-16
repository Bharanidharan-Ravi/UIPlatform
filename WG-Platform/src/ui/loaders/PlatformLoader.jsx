import { Box, CircularProgress } from '@mui/material';

export function PlatformLoader({ label = 'Loading', size = 32, ...props }) {
  return (
    <Box
      alignItems="center"
      display="flex"
      gap={1.5}
      justifyContent="center"
      role="status"
      {...props}
    >
      <CircularProgress size={size} />
      <span>{label}</span>
    </Box>
  );
}
