import { Button, Loader, Stack, ThemeIcon } from '@mantine/core';
import { IconCircleCheck, IconLink } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { Link, useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import { AuthCardLayout } from '../components/AuthLayouts';
import { setUser } from '../store/authSlice';

/**
 * Opened from the verify email: `/verify-email?token=...`
 *
 * Sends the token once on load. Works logged in or out; the button goes to
 * Analyze or to login. A new link can be sent from the banner in the app.
 */
export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const sent = useRef(false);

  const verifyEmail = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      if (user) dispatch(setUser({ ...user, emailVerified: true }));
    },
  });
  const { mutate } = verifyEmail;

  // The ref stops React StrictMode from sending it twice, which would use the token up.
  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    mutate({ token });
  }, [token, mutate]);

  const nextButton = user ? (
    <Button component={Link} to={ROUTES.analyze}>
      Analyze a package
    </Button>
  ) : (
    <Button component={Link} to={ROUTES.login}>
      Log in
    </Button>
  );

  if (verifyEmail.isSuccess) {
    return (
      <AuthCardLayout
        title="Email verified"
        subtitle="Your email is confirmed. You're all set."
      >
        <Stack gap="md">
          <ThemeIcon size={48} radius="xl" variant="light" color="green">
            <IconCircleCheck size={24} />
          </ThemeIcon>
          {nextButton}
        </Stack>
      </AuthCardLayout>
    );
  }

  if (!token || verifyEmail.isError) {
    return (
      <AuthCardLayout
        title="This link doesn't work"
        subtitle={
          !token ||
          (isAxiosError(verifyEmail.error) &&
            verifyEmail.error.response?.status === 400)
            ? 'It may have expired (links last 24 hours) or been used already.'
            : getErrorMessage(verifyEmail.error)
        }
      >
        <Stack gap="md">
          <ThemeIcon size={48} radius="xl" variant="light" color="red">
            <IconLink size={24} />
          </ThemeIcon>
          {nextButton}
        </Stack>
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout
      title="Verifying your email"
      subtitle="This takes a second."
    >
      <Loader aria-label="Verifying" />
    </AuthCardLayout>
  );
};
