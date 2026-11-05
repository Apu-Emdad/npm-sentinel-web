import { Alert, Button, FileButton, Group, Stack, Text } from '@mantine/core';
import { IconArrowRight, IconUpload } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormCheckbox, FormTextarea } from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { scansApi } from '../api/scansApi';
import {
  bulkScanSchema,
  readPackageJson,
  type BulkScanValues,
} from '../schemas/bulkScan.schema';

/** Scans every dependency of a pasted or uploaded package.json. */
export const BulkScanForm = () => {
  const navigate = useNavigate();

  const createBulkScan = useMutation({
    mutationFn: scansApi.createBulkScan,
    onSuccess: (bulkScan) => navigate(`${ROUTES.bulkScans}/${bulkScan.uid}`),
  });
  const form = useForm<BulkScanValues>({
    resolver: zodResolver(bulkScanSchema),
    defaultValues: { packageJson: '', includeDev: true },
  });

  const [packageJson, includeDev] = useWatch({
    control: form.control,
    name: ['packageJson', 'includeDev'],
  });
  const found = readPackageJson(packageJson, includeDev);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    form.setValue('packageJson', await file.text(), { shouldValidate: true });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => createBulkScan.mutate(values))}
        noValidate
        style={{ width: '100%', textAlign: 'left' }}
      >
        <Stack gap="sm">
          {createBulkScan.isError && (
            <Alert color="red" variant="light">
              {getErrorMessage(createBulkScan.error)}
            </Alert>
          )}
          <FormTextarea
            name="packageJson"
            label="Paste your package.json"
            placeholder='{ "dependencies": { "express": "^4.21.1", "lodahs": "1.0.2" } }'
            rows={14}
            wrap="off"
            spellCheck={false}
            styles={{ input: { fontSize: 13, whiteSpace: 'pre' } }}
          />

          <Group justify="space-between" gap="sm">
            <Group gap="md">
              <FileButton
                accept=".json,application/json"
                onChange={handleUpload}
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="default"
                    c="dimmed"
                    fw={400}
                    leftSection={<IconUpload size={16} />}
                    style={{ borderStyle: 'dashed' }}
                  >
                    Upload file
                  </Button>
                )}
              </FileButton>
              <FormCheckbox name="includeDev" label="Include devDependencies" />
            </Group>
            <Button
              type="submit"
              size="md"
              loading={createBulkScan.isPending}
              rightSection={<IconArrowRight size={16} />}
            >
              Scan all
            </Button>
          </Group>

          <Text size="xs" c="dimmed">
            {!('error' in found) && (
              <>
                <Text span inherit fw={700} c="var(--mantine-color-text)">
                  {plural(
                    found.dependencies + found.devDependencies,
                    'package',
                    'packages',
                  )}{' '}
                  found
                </Text>{' '}
                ({plural(found.dependencies, 'dependency', 'dependencies')}
                {includeDev &&
                  `, ${plural(found.devDependencies, 'devDependency', 'devDependencies')}`}
                ).{' '}
              </>
            )}
            Only the names and versions are read. Each one becomes its own scan.
          </Text>
        </Stack>
      </form>
    </FormProvider>
  );
};

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;
