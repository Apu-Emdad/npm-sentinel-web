import { Avatar, Badge, Group, Modal, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { getErrorMessage } from '@/shared/api/interceptor';
import { usersApi } from '../api/usersApi';

interface Props {
  /** The user to show; the modal is closed while this is empty. */
  uid: string | null;
  onClose: () => void;
}

export const UserDetailsModal = ({ uid, onClose }: Props) => {
  const {
    data: user,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['users', uid],
    queryFn: () => usersApi.getUser(uid ?? ''),
    enabled: !!uid,
  });

  return (
    <Modal opened={!!uid} onClose={onClose} title="User details" centered>
      {isPending && <PageLoader />}
      {error && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}
      {user && (
        <Stack gap="md">
          <Group gap="sm" wrap="nowrap">
            <Avatar size={48} name={user.userName} color="initials" />
            <div>
              <Text fw={600}>{user.userName}</Text>
              <Text size="sm" c="dimmed">
                {user.email}
              </Text>
            </div>
          </Group>
          <Group gap="xl">
            <div>
              <Text size="xs" c="dimmed">
                Role
              </Text>
              <Badge variant="light">{user.roleInfo.name}</Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Status
              </Text>
              <Badge variant="light" color={user.isActive ? 'green' : 'yellow'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Created
              </Text>
              <Text size="sm">
                {dayjs(user.createdAt).format('DD MMM YYYY, HH:mm')}
              </Text>
            </div>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
