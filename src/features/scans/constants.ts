import type { CheckType, ScanError, Severity } from './types';

/** Every check a scan runs, with what it looks for. */
export const CHECKS: Record<CheckType, { label: string; description: string }> =
  {
    install_scripts: {
      label: 'Install scripts',
      description: 'Code that runs on npm install',
    },
    typosquatting: {
      label: 'Typosquatting',
      description: 'Names close to popular packages',
    },
    obfuscation: {
      label: 'Obfuscation',
      description: 'Hidden or encoded code',
    },
    maintainer_anomaly: {
      label: 'Maintainers',
      description: 'Odd owner or publish changes',
    },
    suspicious_dependency: {
      label: 'Dependencies',
      description: 'Suspicious packages it pulls in',
    },
  };

/** Label and Mantine color of each severity, highest first. */
export const SEVERITIES: Record<Severity, { label: string; color: string }> = {
  high: { label: 'High', color: 'red' },
  medium: { label: 'Medium', color: 'orange' },
  low: { label: 'Low', color: 'blue' },
};

/** Color of the score ring and risk badge; a low risk is good news, so green. */
export const RISK_COLORS: Record<Severity, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

/** What each failure means; `canRetry` is false when scanning again would fail the same way. */
export const SCAN_ERRORS: Record<
  ScanError,
  { title: string; message: string; canRetry: boolean }
> = {
  package_not_found: {
    title: 'Package not found',
    message: 'There is no package with this name on the npm registry.',
    canRetry: false,
  },
  version_not_found: {
    title: 'Version not found',
    message: 'The package exists, but not with this version.',
    canRetry: false,
  },
  tarball_too_large: {
    title: 'Package is too large',
    message: 'The package is over the size limit, so it was not scanned.',
    canRetry: false,
  },
  timeout: {
    title: 'Scan timed out',
    message: 'The scan took too long. The npm registry may be slow.',
    canRetry: true,
  },
  internal_error: {
    title: 'Scan failed',
    message: 'Something went wrong on our side while scanning.',
    canRetry: true,
  },
};

/** How often the report page asks for the scan while it is not done. */
export const POLL_INTERVAL_MS = 2_000;
