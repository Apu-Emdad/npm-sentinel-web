import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { cssVariablesResolver, theme } from '@/theme/theme';

/** Mantine keeps the light/dark choice in localStorage by itself. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="dark"
    >
      {children}
    </MantineProvider>
  );
};
