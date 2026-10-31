import { Avatar, Badge, Button, Group, Menu, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { authApi } from '@/features/auth/api/authApi';
import { clearSession } from '@/features/auth/store/authSlice';
import { ROUTES } from '@/shared/constants/routes';

/** Logged in: avatar menu with email, role and log out. Guest: a log in button. */
export const UserMenu = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // The session ends on this device even if the API call fails.
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      dispatch(clearSession());
      queryClient.clear();
    },
  });

  if (!user) {
    return (
      <Button component={Link} to={ROUTES.login} variant="default">
        Log in
      </Button>
    );
  }

  return (
    <Menu position="bottom-end" width={240}>
      <Menu.Target>
        <Button variant="subtle" color="gray" px="xs" aria-label="Account menu">
          <Group gap="xs" wrap="nowrap">
            <Avatar size={32} color="amber" variant="filled">
              {user.userName.slice(0, 2).toUpperCase()}
            </Avatar>
            <Text fz="sm" visibleFrom="sm">
              {user.userName}
            </Text>
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Text fz="xs" c="dimmed">
            {user.email}
          </Text>
          <Badge mt={6} size="sm" variant="light">
            {user.role}
          </Badge>
        </Menu.Label>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={() => logout.mutate()}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
