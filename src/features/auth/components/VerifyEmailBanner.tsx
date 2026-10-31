import { Alert, Anchor, Text } from '@mantine/core';
import { useSessionStorage } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store/hooks';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { authApi } from '../api/authApi';

/** Shown in the app shell until the email is verified. Dismissing hides it until the tab closes. */
export const VerifyEmailBanner = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dismissed, setDismissed] = useSessionStorage({
    key: 'verify-email-banner-dismissed',
    defaultValue: false,
  });

  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (result) => notifySuccess(result.message),
    onError: notifyError,
  });

  if (user?.emailVerified !== false || dismissed) return null;

  return (
    <Alert
      variant="light"
      color="amber"
      icon={<IconMail size={18} />}
      withCloseButton
      closeButtonLabel="Dismiss"
      onClose={() => setDismissed(true)}
      py="xs"
      mb="lg"
    >
      <Text fz="sm">
        <Text span fw={700} c="var(--app-accent-text)">
          Verify your email.
        </Text>{' '}
        We sent a link to {user.email}.{' '}
        <Anchor
          component="button"
          type="button"
          fz="sm"
          fw={700}
          disabled={resend.isPending}
          onClick={() => resend.mutate()}
        >
          {resend.isPending ? 'Sending...' : 'Resend link'}
        </Anchor>
      </Text>
    </Alert>
  );
};
