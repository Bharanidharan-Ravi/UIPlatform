import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isPlatformDebugEnabled, QUERY } from "../debug/index.js";

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isPlatformDebugEnabled(QUERY) && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}

// import { useState } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// export function QueryProvider({ children, client, clientOptions }) {
//   const [internalClient] = useState(
//     () => client || new QueryClient(clientOptions)
//   );

//   return (
//     <QueryClientProvider client={client || internalClient}>
//       {children}
//     </QueryClientProvider>
//   );
// }
