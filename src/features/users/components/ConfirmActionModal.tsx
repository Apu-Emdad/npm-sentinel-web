import { Button, Group, Modal, Text } from '@mantine/core';
import type { PendingAction } from '../types';

interface Props {
  /** The action to confirm; the modal is closed while this is empty. */
  action: PendingAction | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const COPY = {
  deactivate: {
    title: 'Deactivate',
    body: "The user can't log in until they are activated again, and their sessions end now.",
    confirm: 'Deactivate user',
  },
  delete: {
    title: 'Delete',
    body: "This removes the user and ends their sessions. You can't undo this.",
    confirm: 'Delete user',
  },
};

export const ConfirmActionModal = ({
  action,
  isLoading,
  onConfirm,
  onClose,
}: Props) => {
  // Keeps the text while the modal closes, so it doesn't flash empty.
  const copy = COPY[action?.type ?? 'delete'];

  return (
    <Modal
      opened={!!action}
      onClose={onClose}
      title={`${copy.title} ${action?.user.userName ?? ''}?`}
      centered
    >
      <Text size="sm" c="dimmed">
        {copy.body}
      </Text>
      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" loading={isLoading} onClick={onConfirm}>
          {copy.confirm}
        </Button>
      </Group>
    </Modal>
  );
};
