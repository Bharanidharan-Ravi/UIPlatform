import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children, client, clientOptions }) {
  const [internalClient] = useState(
    () => client || new QueryClient(clientOptions)
  );

  return (
    <QueryClientProvider client={client || internalClient}>
      {children}
    </QueryClientProvider>
  );
}
