import { Alert, Anchor, Button, Group, Stack, Text } from '@mantine/core';
import {
  IconArrowRight,
  IconLock,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import {
  FormPasswordInput,
  FormTextInput,
} from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import { AuthSplitLayout } from '../components/AuthLayouts';
import {
  registerSchema,
  type RegisterValues,
} from '../schemas/register.schema';
import { setSession } from '../store/authSlice';

const STEPS = [
  {
    title: 'Type a package name',
    text: 'Any public npm package, with or without a version.',
  },
  {
    title: 'Sentinel reads it for you',
    text: 'Metadata, scripts and code, in a safe sandbox.',
  },
  {
    title: 'Get a score with reasons',
    text: 'Each finding shows the file and the exact code.',
  },
];

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // The API logs the new user in, so go straight to Analyze.
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (payload) => {
      dispatch(setSession(payload));
      navigate(ROUTES.analyze, { replace: true });
    },
  });
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ confirmPassword: _confirm, ...values }: RegisterValues) =>
    register.mutate(values);

  return (
    <AuthSplitLayout
      title="Create account"
      subtitle="It takes a few seconds. You're logged in right after."
      aside={
        <>
          <Stack
            component="ol"
            gap={22}
            m={0}
            p={0}
            style={{ listStyle: 'none' }}
          >
            {STEPS.map((step, index) => (
              <Group
                component="li"
                key={step.title}
                gap="md"
                align="flex-start"
                wrap="nowrap"
              >
                <Text c="#f59e0b" fw={700}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <div>
                  <Text c="#e9edf2" fw={700}>
                    {step.title}
                  </Text>
                  <Text c="#94a0b0" fz="sm">
                    {step.text}
                  </Text>
                </div>
              </Group>
            ))}
          </Stack>
          <Text fz={22} fw={700} c="#e9edf2" lh={1.3}>
            Free account.
            <br />
            Every scan is saved to your history.
          </Text>
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Stack gap="sm">
            {register.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(register.error)}
              </Alert>
            )}
            <FormTextInput
              name="userName"
              label="User name"
              placeholder="apu_emdad"
              leftSection={<IconUser size={16} />}
              autoComplete="username"
            />
            <FormTextInput
              name="email"
              label="Email"
              placeholder="name@company.com"
              leftSection={<IconMail size={16} />}
              autoComplete="email"
            />
            <FormPasswordInput
              name="password"
              label="Password"
              placeholder="At least 8 characters"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <FormPasswordInput
              name="confirmPassword"
              label="Confirm password"
              placeholder="Repeat your password"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              mt="xs"
              size="md"
              loading={register.isPending}
              rightSection={<IconArrowRight size={16} />}
            >
              Create account
            </Button>
            <Text ta="center" fz="sm" c="dimmed">
              Have an account?{' '}
              <Anchor component={Link} to={ROUTES.login} fz="sm" fw={500}>
                Log in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </FormProvider>
    </AuthSplitLayout>
  );
};
