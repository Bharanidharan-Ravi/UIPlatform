import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useGlobalLoader } from './useGlobalLoader.js';

export function GlobalApiLoader({
  label = 'Loading...',
  zIndex = 1300,
  sx,
  renderContent,
  display,
  alignItems,
  justifyContent,
  flexDirection,
  gap,
  ...props
}) {
  const { loading, loadingCount } = useGlobalLoader();

  if (!loading) {
    return null;
  }

  const content =
    typeof renderContent === 'function' ? (
      renderContent({ loading, loadingCount, label })
    ) : (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}
      >
        <CircularProgress color="inherit" />
        <span>{label}</span>
      </Box>
    );

  return (
    <Backdrop
      open
      sx={{
        color: '#fff',
        zIndex,
        ...(display !== undefined ? { display } : null),
        ...(alignItems !== undefined ? { alignItems } : null),
        ...(justifyContent !== undefined ? { justifyContent } : null),
        ...(flexDirection !== undefined ? { flexDirection } : null),
        ...(gap !== undefined ? { gap } : null),
        ...sx
      }}
      {...props}
    >
      {content}
    </Backdrop>
  );
}
