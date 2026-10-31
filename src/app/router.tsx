import { createBrowserRouter } from 'react-router';
import {
  GuestOnly,
  RequireAuth,
  RequireRole,
} from '@/features/auth/guards/guards';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { AnalyzePage } from '@/features/scans/pages/AnalyzePage';
import { ScansPage } from '@/features/scans/pages/ScansPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { ROLE } from '@/shared/constants/roles';
import { ROUTES } from '@/shared/constants/routes';
import { NotFoundPage } from './NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Scanning works without an account.
      { path: ROUTES.analyze, element: <AnalyzePage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.scans, element: <ScansPage /> },
          {
            element: <RequireRole role={ROLE.SUPER_ADMIN} />,
            children: [{ path: ROUTES.users, element: <UsersPage /> }],
          },
        ],
      },
    ],
  },
  {
    element: <GuestOnly />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
    ],
  },
  // These work logged in or out.
  { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
  { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
  { path: ROUTES.verifyEmail, element: <VerifyEmailPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
