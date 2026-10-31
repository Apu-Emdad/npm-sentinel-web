import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { notifyError } from '@/shared/utils/notify';

/** A failed query shows the API's message. Mutations handle their own errors. */
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyError }),
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
