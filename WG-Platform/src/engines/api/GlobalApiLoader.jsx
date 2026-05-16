import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useGlobalLoader } from './useGlobalLoader.js';

export function GlobalApiLoader({
  label = 'Loading...',
  zIndex = 1300,
  sx,
  ...props
}) {
  const { loading } = useGlobalLoader();

  if (!loading) {
    return null;
  }

  return (
    <Backdrop
      open
      sx={{
        color: '#fff',
        zIndex,
        ...sx
      }}
      {...props}
    >
      <Box alignItems="center" display="flex" flexDirection="column" gap={1.5}>
        <CircularProgress color="inherit" />
        <span>{label}</span>
      </Box>
    </Backdrop>
  );
}
