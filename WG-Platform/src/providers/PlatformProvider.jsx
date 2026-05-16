import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createPlatformTheme } from '../themes/createPlatformTheme.js';
import { ApiProvider } from './ApiProvider.jsx';
import { QueryProvider } from './QueryProvider.jsx';

export function PlatformProvider({
  children,
  apiBaseUrl,
  apiClient,
  apiConfig,
  apiHeaders,
  getApiHeaders,
  queryClient,
  queryClientOptions,
  theme,
  themeOptions,
  withCssBaseline = true
}) {
  const resolvedTheme = useMemo(
    () => theme || createPlatformTheme(themeOptions),
    [theme, themeOptions]
  );

  return (
    <QueryProvider client={queryClient} clientOptions={queryClientOptions}>
      <ApiProvider
        baseUrl={apiBaseUrl}
        client={apiClient}
        config={apiConfig}
        headers={apiHeaders}
        getHeaders={getApiHeaders}
      >
        <ThemeProvider theme={resolvedTheme}>
          {withCssBaseline ? <CssBaseline /> : null}
          <div className="wg-platform-root">{children}</div>
        </ThemeProvider>
      </ApiProvider>
    </QueryProvider>
  );
}
