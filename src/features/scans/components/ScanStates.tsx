import {
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { SCAN_ERRORS } from '../constants';
import type { Scan } from '../types';

interface PendingProps {
  scan: Scan;
}

/** A queued or running scan; the page keeps polling until it is done. */
export const ScanPending = ({ scan }: PendingProps) => {
  const isQueued = scan.status === 'queued';

  return (
    <Paper withBorder p="xl">
      <Stack align="center" gap="sm" ta="center">
        <Loader />
        <Badge color={isQueued ? 'gray' : 'amber'} variant="light" size="lg">
          {isQueued ? 'Queued' : 'Running'}
        </Badge>
        <Text>
          {isQueued
            ? 'Waiting for a worker to pick up the scan.'
            : 'Downloading the package and running the checks.'}
        </Text>
        <Text size="sm" c="dimmed">
          Scans usually take under a minute. You can leave this page; this link
          keeps working.
        </Text>
      </Stack>
    </Paper>
  );
};

interface FailedProps {
  scan: Scan;
  onRetry: () => void;
  retrying: boolean;
}

/** A failed scan, with what went wrong. */
export const ScanFailed = ({ scan, onRetry, retrying }: FailedProps) => {
  const reason = SCAN_ERRORS[scan.error ?? 'internal_error'];

  return (
    <Paper withBorder p="xl">
      <Stack align="center" gap="sm" ta="center">
        <IconAlertTriangle
          size={40}
          color="var(--mantine-color-red-6)"
          aria-hidden
        />
        <Text fw={700} fz="lg">
          {reason.title}
        </Text>
        <Text c="dimmed">{reason.message}</Text>
        <Group>
          {reason.canRetry && (
            <Button
              variant="default"
              leftSection={<IconRefresh size={16} />}
              loading={retrying}
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
          <Button component={Link} to={ROUTES.analyze}>
            Scan another package
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
