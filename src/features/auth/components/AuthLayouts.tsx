import { Box, Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ColorSchemeToggle } from '@/shared/components/ui/ColorSchemeToggle';
import { Logo } from '@/shared/components/ui/Logo';
import { ROUTES } from '@/shared/constants/routes';
import classes from './AuthLayouts.module.css';

interface Props {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

const Heading = ({ title, subtitle }: Omit<Props, 'children'>) => (
  <div>
    <Title order={1} fz={26}>
      {title}
    </Title>
    {subtitle && (
      <Text c="dimmed" fz="sm" mt={4}>
        {subtitle}
      </Text>
    )}
  </div>
);

/** Log in and register: a dark panel on the left, the form on the right. */
export const AuthSplitLayout = ({
  aside,
  title,
  subtitle,
  children,
}: Props & { aside: ReactNode }) => {
  return (
    <div className={classes.split}>
      <section className={classes.aside}>
        <Link
          to={ROUTES.analyze}
          aria-label="npm-sentinel home"
          style={{ color: '#e9edf2', textDecoration: 'none' }}
        >
          <Logo />
        </Link>
        {aside}
      </section>
      <section className={classes.formSide}>
        <Box className={classes.toggle}>
          <ColorSchemeToggle />
        </Box>
        <Stack gap="md" w="100%" maw={380}>
          <Heading title={title} subtitle={subtitle} />
          {children}
        </Stack>
      </section>
    </div>
  );
};

/** Forgot password, reset password and verify email: one centered card. */
export const AuthCardLayout = ({ title, subtitle, children }: Props) => {
  return (
    <div className={classes.centered}>
      <Box className={classes.toggle}>
        <ColorSchemeToggle />
      </Box>
      <Link
        to={ROUTES.analyze}
        aria-label="npm-sentinel home"
        style={{ color: 'inherit', textDecoration: 'none', marginBottom: 28 }}
      >
        <Logo />
      </Link>
      <Paper withBorder p={32} w="100%" maw={420}>
        <Stack gap="md">
          <Heading title={title} subtitle={subtitle} />
          {children}
        </Stack>
      </Paper>
    </div>
  );
};

/** The sample scan on the log in page. */
export const TerminalPreview = () => {
  return (
    <div className={classes.terminal}>
      <div className={classes.terminalBar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <pre className={classes.terminalBody}>
        <span style={{ color: '#f59e0b' }}>$</span> sentinel scan lodahs@1.0.2
        {'\n'}
        <span style={{ color: '#94a0b0' }}>
          {'  '}fetching metadata ........ done{'\n'}
          {'  '}downloading tarball ...... done{'\n'}
        </span>
        <span style={{ color: '#f97066' }}>
          {'  '}x postinstall runs curl | sh{'     '}HIGH{'\n'}
          {'  '}x sends process.env out{'          '}HIGH{'\n'}
        </span>
        <span style={{ color: '#f59e0b' }}>
          {'  '}! name close to "lodash"{'         '}MEDIUM{'\n'}
        </span>
        <span style={{ color: '#4ade80' }}>
          {'  '}v no obfuscated code{'\n'}
        </span>
        {'\n'}
        {'  '}risk score <b style={{ color: '#f97066' }}>72/100</b>
        {'  '}-&gt;{'  '}don't install
      </pre>
    </div>
  );
};
