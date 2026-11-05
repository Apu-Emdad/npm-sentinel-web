import {
  Badge,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { BulkScanForm } from '../components/BulkScanForm';
import { SingleScanForm } from '../components/SingleScanForm';
import { CHECKS } from '../constants';

type ScanType = 'single' | 'bulk';

/**
 * Home page: scan one package or a whole package.json. Works without logging in.
 *
 * Other pages can open the package.json tab by navigating here with `{ state: { scanType: 'bulk' } }`.
 */
export const AnalyzePage = () => {
  const location = useLocation();
  const [scanType, setScanType] = useState<ScanType>(
    location.state?.scanType ?? 'single',
  );

  return (
    <Stack gap={56} maw={1040} mx="auto" py={56}>
      <Stack align="center" gap="md" ta="center" maw={760} mx="auto" w="100%">
        <Badge variant="outline" color="gray" c="var(--app-accent-text)">
          npm package risk scanner
        </Badge>
        <Title order={1} fz={{ base: 28, sm: 36 }} lh={1.2}>
          Check a package before you install it
        </Title>
        <Text c="dimmed" maw={600}>
          Sentinel downloads the package, reads its code and metadata, and gives
          it a risk score with the reasons.
        </Text>

        <SegmentedControl
          aria-label="Scan type"
          mt="md"
          color="amber"
          value={scanType}
          onChange={(value) => setScanType(value as ScanType)}
          data={[
            { label: 'One package', value: 'single' },
            { label: 'package.json', value: 'bulk' },
          ]}
        />
        {scanType === 'single' ? <SingleScanForm /> : <BulkScanForm />}

        <Text size="xs" c="dimmed">
          Scans run in the background. You can leave the report page and come
          back to its link later.
        </Text>
      </Stack>

      <Stack gap="md" component="section" aria-labelledby="checks">
        <Text id="checks" size="sm" fw={500} c="dimmed">
          // what each scan checks
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm">
          {Object.entries(CHECKS).map(([type, check]) => (
            <Paper key={type} withBorder p="md">
              <Text fw={700}>{check.label}</Text>
              <Text size="xs" c="dimmed">
                {check.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
};
