import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormTextInput } from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { scansApi } from '../api/scansApi';
import { CHECKS } from '../constants';
import { scanSchema, type ScanValues } from '../schemas/scan.schema';
import type { CreateScanBody } from '../types';

/** Home page: submit a package and go to its report. Works without logging in. */
export const AnalyzePage = () => {
  const navigate = useNavigate();

  const createScan = useMutation({
    mutationFn: scansApi.createScan,
    onSuccess: (scan) => navigate(`${ROUTES.scans}/${scan.uid}`),
  });
  const form = useForm<ScanValues>({
    resolver: zodResolver(scanSchema),
    defaultValues: { target: '' },
  });

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

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createScan.mutate(toScanBody(values.target)),
            )}
            noValidate
            style={{ width: '100%', marginTop: 16 }}
          >
            <Stack gap="sm">
              {createScan.isError && (
                <Alert color="red" variant="light" ta="left">
                  {getErrorMessage(createScan.error)}
                </Alert>
              )}
              <Group gap="xs" align="flex-start">
                <FormTextInput
                  name="target"
                  aria-label="Package name"
                  placeholder="lodash or lodash@4.17.21"
                  size="lg"
                  leftSection={
                    <Text fw={700} c="var(--app-accent-text)">
                      $
                    </Text>
                  }
                  autoComplete="off"
                  spellCheck={false}
                  style={{ flex: '1 1 320px', textAlign: 'left' }}
                />
                <Button
                  type="submit"
                  size="lg"
                  loading={createScan.isPending}
                  rightSection={<IconArrowRight size={18} />}
                >
                  Scan
                </Button>
              </Group>
            </Stack>
          </form>
        </FormProvider>

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

/**
 * Splits `name@version` into the scan request
 *
 * The `@` at the start of a scoped name (`@scope/name`) is not a version.
 */
const toScanBody = (target: string): CreateScanBody => {
  const versionAt = target.lastIndexOf('@');
  if (versionAt <= 0) return { packageName: target };

  return {
    packageName: target.slice(0, versionAt),
    version: target.slice(versionAt + 1),
  };
};
