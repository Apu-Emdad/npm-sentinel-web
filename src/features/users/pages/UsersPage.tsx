import { Stack, Text, Title } from '@mantine/core';

/** Users admin. Built in #4. */
export const UsersPage = () => {
  return (
    <Stack gap={4}>
      <Title order={2} fz={26}>
        Users
      </Title>
      <Text c="dimmed">
        Change roles, turn accounts on or off, or remove them.
      </Text>
    </Stack>
  );
};
