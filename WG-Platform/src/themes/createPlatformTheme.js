import { createTheme } from '@mui/material';

export function createPlatformTheme(options = {}) {
  return createTheme({
    shape: {
      borderRadius: 6
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#2454a6'
      },
      secondary: {
        main: '#0f766e'
      },
      background: {
        default: '#f6f8fb',
        paper: '#ffffff'
      },
      text: {
        primary: '#172033',
        secondary: '#5b677a'
      }
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      button: {
        textTransform: 'none'
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 6
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        }
      }
    },
    ...options
  });
}
