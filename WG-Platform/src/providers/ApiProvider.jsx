import { createContext, useContext, useMemo } from 'react';
import { createApiClient } from '../engines/crud/apiClient.js';

const ApiContext = createContext(null);

export function ApiProvider({
  children,
  client,
  baseUrl,
  config,
  headers,
  getHeaders
}) {
  const apiClient = useMemo(
    () =>
      client ||
      createApiClient({
        ...(config || {}),
        baseUrl: baseUrl ?? config?.baseUrl,
        headers: headers ?? config?.headers,
        getHeaders: getHeaders ?? config?.getHeaders
      }),
    [baseUrl, client, config, getHeaders, headers]
  );

  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
}

export function useApiClient() {
  const client = useContext(ApiContext);

  if (!client) {
    throw new Error('useApiClient must be used within ApiProvider.');
  }

  return client;
}

export const usePlatformApi = useApiClient;
