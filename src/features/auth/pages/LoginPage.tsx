import { Alert, Anchor, Button, Group, Stack, Text } from '@mantine/core';
import { IconArrowRight, IconLock, IconUser } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import {
  FormPasswordInput,
  FormTextInput,
} from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import { AuthSplitLayout, TerminalPreview } from '../components/AuthLayouts';
import { loginSchema, type LoginValues } from '../schemas/login.schema';
import { setSession } from '../store/authSlice';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, go back to the page the user was sent away from, or Analyze.
  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.analyze;

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (payload) => {
      dispatch(setSession(payload));
      navigate(from, { replace: true });
    },
  });
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userNameOrEmail: '', password: '' },
  });

  return (
    <AuthSplitLayout
      title="Log in"
      subtitle="Welcome back. Log in to scan packages."
      aside={
        <>
          <TerminalPreview />
          <div>
            <Text fz={22} fw={700} c="#e9edf2" lh={1.3}>
              Know what a package does
              <br />
              before npm install runs it.
            </Text>
            <Text fz="sm" c="#94a0b0" mt={8}>
              Install scripts, typosquatting, obfuscation, maintainer changes
              and risky dependencies.
            </Text>
          </div>
        </>
      }
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
          noValidate
        >
          <Stack gap="sm">
            {login.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(login.error)}
              </Alert>
            )}
            <FormTextInput
              name="userNameOrEmail"
              label="User name or email"
              placeholder="name@company.com"
              leftSection={<IconUser size={16} />}
              autoComplete="username"
            />
            <FormPasswordInput
              name="password"
              label={
                <Group justify="space-between" wrap="nowrap">
                  Password
                  <Anchor
                    component={Link}
                    to={ROUTES.forgotPassword}
                    fz="xs"
                    fw={500}
                  >
                    Forgot password?
                  </Anchor>
                </Group>
              }
              labelProps={{ style: { width: '100%' } }}
              placeholder="Your password"
              leftSection={<IconLock size={16} />}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              mt="xs"
              size="md"
              loading={login.isPending}
              rightSection={<IconArrowRight size={16} />}
            >
              Log in
            </Button>
            <Text ta="center" fz="sm" c="dimmed">
              No account?{' '}
              <Anchor component={Link} to={ROUTES.register} fz="sm" fw={500}>
                Create one
              </Anchor>
            </Text>
          </Stack>
        </form>
      </FormProvider>
    </AuthSplitLayout>
  );
};
