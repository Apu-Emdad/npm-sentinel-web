import { Stack, Text, Title } from '@mantine/core';

/** List of scans. Built in a later issue. */
export const ScansPage = () => {
  return (
    <Stack gap={4}>
      <Title order={2} fz={26}>
        Scans
      </Title>
      <Text c="dimmed">Every package you have scanned shows up here.</Text>
    </Stack>
  );
};
