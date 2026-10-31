import {
  Badge,
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';

/** Brand amber. Shade 5 (#F59E0B) is the accent in both modes. */
const amber: MantineColorsTuple = [
  '#FFF8E6',
  '#FEF3C7',
  '#FDE68A',
  '#FCD34D',
  '#FBBF24',
  '#F59E0B',
  '#D97706',
  '#B45309',
  '#92400E',
  '#78350F',
];

/** Dark slate surfaces, lightest text (0) to page background (7). */
const dark: MantineColorsTuple = [
  '#E9EDF2',
  '#C3CAD4',
  '#94A0B0',
  '#6B7686',
  '#2A323E',
  '#222934',
  '#1A2029',
  '#12161C',
  '#0E1116',
  '#0A0C10',
];

const MONO = '"JetBrains Mono", ui-monospace, monospace';

export const theme = createTheme({
  primaryColor: 'amber',
  primaryShade: 5,
  autoContrast: true,
  colors: { amber, dark },
  black: '#1A2029',
  fontFamily: MONO,
  fontFamilyMonospace: MONO,
  headings: { fontFamily: MONO, fontWeight: '700' },
  defaultRadius: 'md',
  radius: { md: '8px', lg: '12px' },
  components: {
    Badge: Badge.extend({ styles: { root: { textTransform: 'none' } } }),
  },
});

/** Page, surface and accent colors from the design tokens (Radar amber). */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': '#FFFFFF',
    '--mantine-color-text': '#1A2029',
    '--mantine-color-dimmed': '#5B6675',
    '--mantine-color-default-border': '#E2E6EB',
    '--mantine-color-anchor': '#B45309',
    '--app-bg': '#F5F6F8',
    '--app-accent-text': '#B45309',
  },
  dark: {
    '--mantine-color-body': '#1A2029',
    '--mantine-color-text': '#E9EDF2',
    '--mantine-color-dimmed': '#94A0B0',
    '--mantine-color-default-border': '#2A323E',
    '--mantine-color-anchor': '#F59E0B',
    '--app-bg': '#12161C',
    '--app-accent-text': '#F59E0B',
  },
});
