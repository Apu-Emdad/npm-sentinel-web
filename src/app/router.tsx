import { createBrowserRouter } from 'react-router';
import { AnalyzePage } from '@/features/scans/pages/AnalyzePage';
import { ScansPage } from '@/features/scans/pages/ScansPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { ROUTES } from '@/shared/constants/routes';
import { NotFoundPage } from './NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.analyze, element: <AnalyzePage /> },
      { path: ROUTES.scans, element: <ScansPage /> },
      { path: ROUTES.users, element: <UsersPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
