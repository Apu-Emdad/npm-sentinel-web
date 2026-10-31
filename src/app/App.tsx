import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { clearSession } from '@/features/auth/store/authSlice';
import { refreshSession } from '@/shared/api/interceptor';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';
import { store } from './store/store';

// The access token lives in memory only, so a page load restores the session with the refresh cookie.
refreshSession().catch(() => store.dispatch(clearSession()));

export const App = () => {
  return (
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  );
};
