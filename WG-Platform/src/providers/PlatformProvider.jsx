import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  GlobalApiError,
  GlobalApiLoader,
  GlobalApiSuccess
} from '../engines/api/index.js';
import { createPlatformTheme } from '../themes/createPlatformTheme.js';
import { ApiProvider } from './ApiProvider.jsx';
import { QueryProvider } from './QueryProvider.jsx';
import { PlatformConfigContext } from './PlatformConfigContext.jsx';

export function PlatformProvider({
  children,
  apiBaseUrl,
  apiClient,
  apiConfig,
  apiHeaders,
  getApiHeaders,
  enableGlobalLoader = false,
  enableGlobalErrors = false,
  enableGlobalSuccess = false,
  globalLoaderProps,
  globalErrorProps,
  globalSuccessProps,
  queryClient,
  queryClientOptions,
  theme,
  themeOptions,
  layoutOptions = {},
  withCssBaseline = true
}) {
  const resolvedTheme = useMemo(
    () => theme || createPlatformTheme(themeOptions),
    [theme, themeOptions]
  );

  return (
    <PlatformConfigContext.Provider value={{ layoutOptions }}>
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
            {enableGlobalSuccess ? (
              <GlobalApiSuccess {...globalSuccessProps} />
            ) : null}
          </ThemeProvider>
        </ApiProvider>
      </QueryProvider>
    </PlatformConfigContext.Provider>
  );
}

