export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed';

export type Severity = 'low' | 'medium' | 'high';

export type CheckType =
  | 'install_scripts'
  | 'typosquatting'
  | 'obfuscation'
  | 'maintainer_anomaly'
  | 'suspicious_dependency';

/** Why a scan failed. */
export type ScanError =
  | 'package_not_found'
  | 'version_not_found'
  | 'tarball_too_large'
  | 'timeout'
  | 'internal_error';

export interface Finding {
  checkType: CheckType;
  severity: Severity;
  summary: string;
  evidence: string;
}

export interface Scan {
  uid: string;
  status: ScanStatus;
  packageName: string;
  /** The scanned version once known, else the requested one; null means latest. */
  version: string | null;
  riskScore: number | null;
  riskLevel: Severity | null;
  findings: Finding[];
  error: ScanError | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

/** What `POST /scans` returns. */
export type CreatedScan = Pick<
  Scan,
  'uid' | 'status' | 'packageName' | 'version' | 'createdAt'
>;

export interface CreateScanBody {
  packageName: string;
  version?: string;
}
