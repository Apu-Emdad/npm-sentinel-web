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

/** One package.json dependency in a bulk scan, with its scan. */
export interface BulkScanItem {
  /** The name as written in package.json; an alias can scan another package. */
  packageName: string;
  range: string;
  isDev: boolean;
  scanUid: string;
  version: string;
  status: ScanStatus;
  riskScore: number | null;
  riskLevel: Severity | null;
  findings: Record<Severity, number>;
  /** Summary of the most severe finding; null when there are none. */
  topFinding: string | null;
}

/** A dependency that was not scanned, e.g. a git URL. */
export interface SkippedDependency {
  packageName: string;
  range: string;
  isDev: boolean;
  reason: string;
}

export interface BulkScan {
  uid: string;
  /** The package.json `name`, if it had one. */
  name: string | null;
  includeDev: boolean;
  createdAt: string;
  progress: { done: number; total: number };
  /** Completed scans by risk; `clean` ones had no findings. */
  counts: Record<Severity | 'clean', number>;
  items: BulkScanItem[];
  skipped: SkippedDependency[];
}

/** What `POST /scans/bulk` returns. */
export interface CreatedBulkScan {
  uid: string;
  createdAt: string;
  total: number;
  skipped: number;
}

export interface CreateBulkScanBody {
  packageJson: string;
  includeDev: boolean;
}
