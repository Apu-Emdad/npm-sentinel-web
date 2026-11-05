import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormTextInput } from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { scansApi } from '../api/scansApi';
import { scanSchema, type ScanValues } from '../schemas/scan.schema';
import type { CreateScanBody } from '../types';

/** Scans one package and goes to its report. */
export const SingleScanForm = () => {
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
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          createScan.mutate(toScanBody(values.target)),
        )}
        noValidate
        style={{ width: '100%' }}
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
