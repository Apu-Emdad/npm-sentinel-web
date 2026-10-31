import { Group, Text } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';

export const APP_NAME = 'npm-sentinel';

export const Logo = () => {
  return (
    <Group gap={10} wrap="nowrap">
      <Group
        justify="center"
        w={28}
        h={28}
        bg="amber.5"
        c="dark.7"
        style={{ borderRadius: 7 }}
      >
        <IconShieldCheck size={16} stroke={2.2} />
      </Group>
      <Text fw={700} fz={16}>
        {APP_NAME}
      </Text>
    </Group>
  );
};
