import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { cssVariablesResolver, theme } from '@/theme/theme';

/** Renders routes with the same providers as the real app. */
export const renderRoutes = (routes: RouteObject[], route = '/') => {
  const router = createMemoryRouter(routes, { initialEntries: [route] });

  const view = render(
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      <RouterProvider router={router} />
    </MantineProvider>,
  );

  return { ...view, router };
};
