import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { GlobalApiError, GlobalApiLoader } from '../engines/api/index.js';
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
  enableGlobalLoader = false,
  enableGlobalErrors = false,
  globalLoaderProps,
  globalErrorProps,
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
          {enableGlobalLoader ? <GlobalApiLoader {...globalLoaderProps} /> : null}
          {enableGlobalErrors ? <GlobalApiError {...globalErrorProps} /> : null}
        </ThemeProvider>
      </ApiProvider>
    </QueryProvider>
  );
}
