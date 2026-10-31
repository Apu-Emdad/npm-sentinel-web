import { RouterProvider } from 'react-router';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';

export const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
