// Imports
// ========================================================
import { httpBatchLink } from '@trpc/client';
import trpc from '~/lib/trpc';
import { queryClient } from './queryPreovider';
import superjson from 'superjson';

// Config
// ========================================================
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      // Needed to support session cookies
      // fetch(url, options) {
      //   return fetch(url, {
      //     ...options,
      //     credentials: 'include'
      //   });
      // }
    })
  ],
  transformer: superjson,
});

// Provider
// ========================================================
const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
    return <trpc.Provider client={trpcClient} queryClient={queryClient}>{children}</trpc.Provider>
};

// Exports
// ========================================================
export default TRPCProvider;
