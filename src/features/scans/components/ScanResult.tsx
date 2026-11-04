import {
  Badge,
  Button,
  Code,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCopy, IconRefresh } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { CHECKS, RISK_COLORS, SEVERITIES } from '../constants';
import type { CheckType, Finding, Scan, Severity } from '../types';

interface Props {
  scan: Scan;
  onRescan: () => void;
  rescanning: boolean;
}

/** A completed scan: score, findings and the result of each check. */
export const ScanResult = ({ scan, onRescan, rescanning }: Props) => {
  const clipboard = useClipboard({ timeout: 2_000 });
  const riskLevel = scan.riskLevel ?? 'low';
  const riskScore = scan.riskScore ?? 0;
  const findings = [...scan.findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <Stack gap="lg">
      <Paper withBorder p="lg">
        <Group gap="xl" align="center">
          <RingProgress
            size={132}
            thickness={12}
            roundCaps
            sections={[{ value: riskScore, color: RISK_COLORS[riskLevel] }]}
            aria-label={`Risk score ${riskScore} out of 100`}
            label={
              <Stack gap={0} align="center">
                <Text fz={32} fw={700} lh={1}>
                  {riskScore}
                </Text>
                <Text size="xs" c="dimmed">
                  / 100
                </Text>
              </Stack>
            }
          />

          <Stack gap="xs" style={{ flex: '999 1 360px', minWidth: 0 }}>
            <Group gap="sm">
              <Title order={1} fz={26} style={{ wordBreak: 'break-all' }}>
                {getPackageLabel(scan)}
              </Title>
              <Badge color={RISK_COLORS[riskLevel]} variant="light" size="lg">
                {SEVERITIES[riskLevel].label} risk
              </Badge>
            </Group>
            <Text c="dimmed">{getVerdict(riskLevel, findings.length)}</Text>
            <Group gap="xs">
              {(Object.keys(SEVERITIES) as Severity[]).map((severity) => (
                <Badge key={severity} variant="outline" color="gray">
                  <Text span fw={700} c={SEVERITIES[severity].color} fz="xs">
                    {countBySeverity(findings, severity)}
                  </Text>{' '}
                  {SEVERITIES[severity].label.toLowerCase()}
                </Badge>
              ))}
              {scan.completedAt && (
                <Text size="xs" c="dimmed">
                  Scanned {dayjs(scan.completedAt).format('D MMM YYYY, HH:mm')}
                  {scan.startedAt &&
                    ` · took ${dayjs(scan.completedAt).diff(scan.startedAt, 'second', true).toFixed(1)} s`}
                </Text>
              )}
            </Group>
          </Stack>

          <Group gap="xs">
            <Button
              variant="default"
              leftSection={
                clipboard.copied ? (
                  <IconCheck size={16} />
                ) : (
                  <IconCopy size={16} />
                )
              }
              onClick={() => clipboard.copy(window.location.href)}
            >
              {clipboard.copied ? 'Copied' : 'Copy link'}
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              loading={rescanning}
              onClick={onRescan}
            >
              Scan again
            </Button>
          </Group>
        </Group>
      </Paper>

      <Group gap="lg" align="flex-start">
        <Stack
          gap="sm"
          component="section"
          aria-labelledby="findings"
          style={{ flex: '999 1 520px', minWidth: 0 }}
        >
          <Title order={2} fz={16} id="findings">
            Findings
          </Title>
          {findings.length ? (
            findings.map((finding, index) => (
              <FindingCard key={index} finding={finding} />
            ))
          ) : (
            <Paper withBorder p="lg">
              <Text c="dimmed">
                No check found anything risky in this package.
              </Text>
            </Paper>
          )}
        </Stack>

        <Paper
          withBorder
          p="lg"
          component="section"
          aria-labelledby="checks"
          style={{ flex: '1 1 260px' }}
        >
          <Title order={2} fz={14} id="checks" mb="sm">
            Checks
          </Title>
          <Stack gap={8}>
            {(Object.keys(CHECKS) as CheckType[]).map((type) => (
              <CheckRow key={type} type={type} findings={findings} />
            ))}
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};

/** One finding, with a stripe in its severity color. */
const FindingCard = ({ finding }: { finding: Finding }) => {
  const severity = SEVERITIES[finding.severity];
  const check = CHECKS[finding.checkType];

  return (
    <Paper
      withBorder
      p="md"
      radius={0}
      component="article"
      style={{
        borderLeft: `4px solid var(--mantine-color-${severity.color}-6)`,
      }}
    >
      <Group justify="space-between" align="flex-start" gap="sm">
        <Text fw={700} style={{ flex: 1, minWidth: 0 }}>
          {finding.summary}
        </Text>
        <Badge color={severity.color} variant="light">
          {severity.label}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed" mt={2}>
        {check.label} · {check.description}
      </Text>
      <Code
        block
        mt="sm"
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
      >
        {finding.evidence}
      </Code>
    </Paper>
  );
};

/** A check's result: "clean", or its findings by severity, e.g. "1 high, 2 low". */
const CheckRow = ({
  type,
  findings,
}: {
  type: CheckType;
  findings: Finding[];
}) => {
  const own = findings.filter((finding) => finding.checkType === type);
  const top = own[0]?.severity;
  const counts = (Object.keys(SEVERITIES) as Severity[])
    .map((severity) => [severity, countBySeverity(own, severity)] as const)
    .filter(([, count]) => count > 0)
    .map(([severity, count]) => `${count} ${severity}`);

  return (
    <Group justify="space-between" gap="sm">
      <Text size="sm">{CHECKS[type].label}</Text>
      <Text
        size="sm"
        fw={top ? 700 : 400}
        c={top ? SEVERITIES[top].color : 'green'}
      >
        {top ? counts.join(', ') : 'clean'}
      </Text>
    </Group>
  );
};

const SEVERITY_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

const countBySeverity = (findings: Finding[], severity: Severity) =>
  findings.filter((finding) => finding.severity === severity).length;

const getPackageLabel = (scan: Scan) =>
  scan.version ? `${scan.packageName}@${scan.version}` : scan.packageName;

/** One line on what the score means. */
const getVerdict = (riskLevel: Severity, findingCount: number) => {
  if (!findingCount) return 'No risky signs found. This package looks safe.';
  if (riskLevel === 'high') {
    return 'Several strong signs of risk. Read the findings before you install it.';
  }
  if (riskLevel === 'medium') {
    return 'Some signs of risk. Check the findings before you install it.';
  }
  return 'Only minor signs. These are common in normal packages.';
};
