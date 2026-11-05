import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconAlertTriangle, IconCheck, IconCopy } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import { scansApi } from '../api/scansApi';
import { POLL_INTERVAL_MS, SEVERITIES } from '../constants';
import type {
  BulkScan,
  BulkScanItem,
  Severity,
  SkippedDependency,
} from '../types';

/** A package.json scan: progress, risk counts and every package. Polls until all scans are done. Works without logging in. */
export const BulkScanReportPage = () => {
  const { uid = '' } = useParams();
  const clipboard = useClipboard({ timeout: 2_000 });

  const bulkScanQuery = useQuery({
    queryKey: ['bulkScan', uid],
    queryFn: () => scansApi.getBulkScan(uid),
    refetchInterval: (query) =>
      isDone(query.state.data) ? false : POLL_INTERVAL_MS,
  });

  if (bulkScanQuery.isPending) return <PageLoader />;

  if (bulkScanQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(bulkScanQuery.error)}
        onRetry={() => bulkScanQuery.refetch()}
      />
    );
  }

  const bulkScan = bulkScanQuery.data;
  const { done, total } = bulkScan.progress;
  const items = [...bulkScan.items].sort(
    (a, b) => (b.riskScore ?? -1) - (a.riskScore ?? -1),
  );
  const riskiest = items.find(
    (item) => item.status === 'completed' && item.riskLevel === 'high',
  );
  const progressColor = isDone(bulkScan) ? 'green' : 'amber';

  return (
    <Stack gap="lg" maw={1120} mx="auto">
      <PageTop
        title="package.json scan"
        description={getSubtitle(bulkScan)}
        backBtn
        rightSection={
          <Badge
            color={progressColor}
            variant="light"
            size="lg"
            leftSection={
              <Box
                w={8}
                h={8}
                bg={`var(--mantine-color-${progressColor}-filled)`}
                style={{ borderRadius: '50%' }}
              />
            }
          >
            {done} of {total} done
          </Badge>
        }
      />

      <Progress
        value={total ? (done / total) * 100 : 100}
        color={progressColor}
        size={6}
        aria-label="Scans done"
      />

      <SimpleGrid
        cols={{ base: 2, sm: 4 }}
        spacing="sm"
        component="section"
        aria-label="Summary"
      >
        {SUMMARY.map(({ key, label, color }) => (
          <Paper
            key={key}
            withBorder
            p="md"
            radius={0}
            style={{
              borderLeft: `4px solid var(--mantine-color-${color}-6)`,
            }}
          >
            <Text size="xs" c="dimmed">
              {label}
            </Text>
            <Text fz={28} fw={700} c={color}>
              {bulkScan.counts[key]}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {riskiest && (
        <Alert
          color="red"
          variant="light"
          icon={<IconAlertTriangle size={20} />}
          style={{ border: '1px solid var(--mantine-color-red-6)' }}
        >
          <Group justify="space-between" gap="sm">
            <div>
              <Text fw={700} c="red">
                Remove {riskiest.packageName}
                {bulkScan.counts.high > 1 &&
                  ` and ${plural(bulkScan.counts.high - 1, 'other high risk package', 'other high risk packages')}`}{' '}
                before your next npm install
              </Text>
              <Text size="sm">{riskiest.topFinding}</Text>
            </div>
            <Anchor
              component={Link}
              to={`${ROUTES.scans}/${riskiest.scanUid}`}
              fw={700}
              c="red"
            >
              See why
            </Anchor>
          </Group>
        </Alert>
      )}

      <Paper withBorder component="section" aria-labelledby="packages">
        <Group justify="space-between" gap="sm" px="md" pt="md" pb={4}>
          <Title order={2} fz={16} id="packages">
            Packages
          </Title>
          <Text size="xs" c="dimmed">
            Sorted by risk, highest first
          </Text>
        </Group>
        <CustomTable
          headers={getTableHeaders()}
          rows={items}
          isPending={false}
          error={null}
          onRetry={() => bulkScanQuery.refetch()}
          emptyTitle="No packages were scanned"
          emptyDescription="None of the dependencies are on the npm registry."
          minWidth={760}
          maxTableHeight="none"
        />
      </Paper>

      {bulkScan.skipped.length > 0 && (
        <Paper withBorder component="section" aria-labelledby="skipped">
          <Stack gap={0} px="md" pt="md" pb={4}>
            <Title order={2} fz={16} id="skipped">
              Skipped
            </Title>
            <Text size="xs" c="dimmed">
              Their code is not on the npm registry, so they were not scanned.
            </Text>
          </Stack>
          <CustomTable
            headers={getSkippedHeaders()}
            rows={bulkScan.skipped}
            isPending={false}
            error={null}
            onRetry={() => bulkScanQuery.refetch()}
            emptyTitle="Nothing was skipped"
            maxTableHeight="none"
          />
        </Paper>
      )}

      <Group gap="xs">
        <Button
          variant="default"
          leftSection={
            clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />
          }
          onClick={() => clipboard.copy(window.location.href)}
        >
          {clipboard.copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button
          component={Link}
          to={ROUTES.analyze}
          state={{ scanType: 'bulk' }}
        >
          Scan another file
        </Button>
      </Group>
    </Stack>
  );
};

/** The risk summary cards, in order. */
const SUMMARY: { key: Severity | 'clean'; label: string; color: string }[] = [
  { key: 'high', label: 'High risk', color: SEVERITIES.high.color },
  { key: 'medium', label: 'Medium risk', color: SEVERITIES.medium.color },
  { key: 'low', label: 'Low risk', color: SEVERITIES.low.color },
  { key: 'clean', label: 'Clean', color: 'green' },
];

const isDone = (bulkScan?: BulkScan) =>
  !!bulkScan && bulkScan.progress.done === bulkScan.progress.total;

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/** e.g. "my-shop-api · 5 packages (4 dependencies, 1 devDependency) · started 14:20" */
const getSubtitle = (bulkScan: BulkScan) => {
  const devCount = bulkScan.items.filter((item) => item.isDev).length;
  const counts = [
    plural(bulkScan.items.length - devCount, 'dependency', 'dependencies'),
  ];
  if (devCount) {
    counts.push(plural(devCount, 'devDependency', 'devDependencies'));
  }

  const createdAt = dayjs(bulkScan.createdAt);
  const startedAt = createdAt.isSame(dayjs(), 'day')
    ? createdAt.format('HH:mm')
    : createdAt.format('D MMM YYYY, HH:mm');

  return [
    bulkScan.name,
    `${plural(bulkScan.items.length, 'package', 'packages')} (${counts.join(', ')})`,
    `started ${startedAt}`,
  ]
    .filter(Boolean)
    .join(' · ');
};

const isPending = (item: BulkScanItem) =>
  item.status === 'queued' || item.status === 'running';

/** Score pill: green when the scan found nothing, else the color of its risk level. */
const RiskCell = ({ item }: { item: BulkScanItem }) => {
  if (isPending(item)) {
    return (
      <Text size="sm" fw={700} c="var(--app-accent-text)">
        ...
      </Text>
    );
  }
  if (item.status === 'failed' || !item.riskLevel) {
    return (
      <Text size="sm" c="dimmed">
        -
      </Text>
    );
  }

  return (
    <Badge
      color={item.topFinding ? SEVERITIES[item.riskLevel].color : 'green'}
      variant="light"
      radius="xl"
      miw={40}
    >
      {item.riskScore}
    </Badge>
  );
};

/** e.g. "2 high, 1 medium", "None", or the scan's state while it is not completed. */
const FindingsCell = ({ item }: { item: BulkScanItem }) => {
  if (item.status === 'failed') {
    return (
      <Text size="sm" c="red">
        Failed
      </Text>
    );
  }
  if (isPending(item)) {
    return (
      <Text size="sm" c="dimmed">
        {item.status === 'queued' ? 'Queued' : 'Running'}
      </Text>
    );
  }

  const counts = (Object.keys(SEVERITIES) as Severity[])
    .filter((severity) => item.findings[severity] > 0)
    .map((severity) => `${item.findings[severity]} ${severity}`);

  return (
    <Text size="sm" c="dimmed">
      {counts.length ? counts.join(', ') : 'None'}
    </Text>
  );
};

const DevBadge = ({ isDev }: { isDev: boolean }) =>
  isDev && (
    <Badge
      variant="outline"
      color="gray"
      size="sm"
      radius="xl"
      c="dimmed"
      fw={400}
    >
      dev
    </Badge>
  );

const getTableHeaders = (): TableHeader<BulkScanItem>[] => [
  {
    label: 'Package',
    render: (item) => (
      <Group gap={6} wrap="nowrap">
        <Text size="sm" fw={500}>
          {item.packageName}
        </Text>
        <DevBadge isDev={item.isDev} />
      </Group>
    ),
  },
  {
    label: 'In package.json',
    render: (item) => (
      <Text size="sm" c="dimmed">
        {item.range}
      </Text>
    ),
  },
  { label: 'Scanned', render: (item) => item.version },
  { label: 'Risk', render: (item) => <RiskCell item={item} /> },
  { label: 'Findings', render: (item) => <FindingsCell item={item} /> },
  {
    label: '',
    render: (item) => (
      <Anchor
        component={Link}
        to={`${ROUTES.scans}/${item.scanUid}`}
        size="sm"
        display="block"
        ta="right"
      >
        {isPending(item) ? 'Watch' : 'View'}
      </Anchor>
    ),
  },
];

const getSkippedHeaders = (): TableHeader<SkippedDependency>[] => [
  {
    label: 'Package',
    render: (dependency) => (
      <Group gap={6} wrap="nowrap">
        <Text size="sm" fw={500}>
          {dependency.packageName}
        </Text>
        <DevBadge isDev={dependency.isDev} />
      </Group>
    ),
  },
  {
    label: 'In package.json',
    render: (dependency) => (
      <Text size="sm" c="dimmed" style={{ wordBreak: 'break-all' }}>
        {dependency.range}
      </Text>
    ),
  },
  {
    label: 'Reason',
    render: (dependency) => (
      <Text size="sm" c="dimmed">
        {dependency.reason}
      </Text>
    ),
  },
];
