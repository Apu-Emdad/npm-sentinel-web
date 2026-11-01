import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconEye, IconTrash, IconUserOff } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { ROLE } from '@/shared/constants/roles';
import { notifyError, notifySuccess } from '@/shared/utils/notify';
import { usersApi } from '../api/usersApi';
import { ConfirmActionModal } from '../components/ConfirmActionModal';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { EMPTY_FILTERS, UsersFilters } from '../components/UsersFilters';
import type { PendingAction, User, UsersFiltersState } from '../types';

export const UsersPage = () => {
  const currentUid = useAppSelector((state) => state.auth.user?.uid);
  const [filters, setFilters] = useState<UsersFiltersState>(EMPTY_FILTERS);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
    placeholderData: keepPreviousData,
  });

  const runAction = useMutation({
    mutationFn: ({ type, user }: PendingAction) =>
      type === 'delete'
        ? usersApi.deleteUser(user.uid)
        : usersApi.deactivateUser(user.uid),
    onSuccess: (result) => {
      notifySuccess(result.message);
      setPendingAction(null);
      refetch();
    },
    onError: notifyError,
  });

  const { users = [], total = 0 } = data ?? {};

  return (
    <Stack gap="md">
      <PageTop title="Users" description={`${total} people can sign in.`} />

      <UsersFilters filters={filters} setFilters={setFilters} />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({
            currentUid,
            onView: (user) => setSelectedUid(user.uid),
            onAction: setPendingAction,
          })}
          rows={users}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle="No users found"
          emptyDescription="Try a different search or clear the filters."
          pagination={{
            page: filters.page,
            pageSize: filters.pageSize,
            total,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>

      <UserDetailsModal
        uid={selectedUid}
        onClose={() => setSelectedUid(null)}
      />
      <ConfirmActionModal
        action={pendingAction}
        isLoading={runAction.isPending}
        onConfirm={() => pendingAction && runAction.mutate(pendingAction)}
        onClose={() => setPendingAction(null)}
      />
    </Stack>
  );
};

interface TableHeadersDeps {
  currentUid: string | undefined;
  onView: (user: User) => void;
  onAction: (action: PendingAction) => void;
}

const getTableHeaders = ({
  currentUid,
  onView,
  onAction,
}: TableHeadersDeps): TableHeader<User>[] => {
  return [
    {
      label: 'User',
      render: (user) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar size={32} name={user.userName} color="initials" />
          <div>
            <Text size="sm" fw={500}>
              {user.userName}
            </Text>
            <Text size="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      label: 'Role',
      render: (user) => (
        <Badge
          variant={
            user.roleInfo.name === ROLE.SUPER_ADMIN ? 'light' : 'outline'
          }
          color={user.roleInfo.name === ROLE.SUPER_ADMIN ? undefined : 'gray'}
        >
          {user.roleInfo.name}
        </Badge>
      ),
    },
    {
      label: 'Status',
      render: (user) => (
        <Badge variant="light" color={user.isActive ? 'green' : 'yellow'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      label: 'Created',
      render: (user) => (
        <Text size="sm" c="dimmed">
          {dayjs(user.createdAt).format('DD MMM YYYY')}
        </Text>
      ),
    },
    {
      label: '',
      render: (user) => (
        <Group gap={4} justify="flex-end" wrap="nowrap">
          <Tooltip label="View">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`View ${user.userName}`}
              onClick={() => onView(user)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          {/* The API refuses these on your own account, so the buttons are hidden. */}
          {user.uid !== currentUid && user.isActive && (
            <Tooltip label="Deactivate">
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label={`Deactivate ${user.userName}`}
                onClick={() => onAction({ type: 'deactivate', user })}
              >
                <IconUserOff size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {user.uid !== currentUid && (
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={`Delete ${user.userName}`}
                onClick={() => onAction({ type: 'delete', user })}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    },
  ];
};
