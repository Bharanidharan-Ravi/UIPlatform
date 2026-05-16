import { Box, Container } from '@mui/material';

export function PlatformShell({
  header,
  sidebar,
  children,
  footer,
  maxWidth = 'xl'
}) {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {header}
      <Box display="flex" flex={1} minHeight={0}>
        {sidebar}
        <Container maxWidth={maxWidth} component="main" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
      {footer}
    </Box>
  );
}
