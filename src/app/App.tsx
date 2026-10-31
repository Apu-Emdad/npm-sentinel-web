import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';
import { store } from './store/store';

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
