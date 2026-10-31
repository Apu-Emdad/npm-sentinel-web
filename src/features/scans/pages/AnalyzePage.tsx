import { Badge, Stack, Text, Title } from '@mantine/core';

/** Home page. The scan form comes in #5. */
export const AnalyzePage = () => {
  return (
    <Stack align="center" gap="md" ta="center" maw={760} mx="auto" py={56}>
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
    </Stack>
  );
};
