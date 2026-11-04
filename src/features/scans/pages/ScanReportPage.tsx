import { Stack } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import { notifyError } from '@/shared/utils/notify';
import { scansApi } from '../api/scansApi';
import { ScanResult } from '../components/ScanResult';
import { ScanFailed, ScanPending } from '../components/ScanStates';
import { POLL_INTERVAL_MS } from '../constants';
import type { Scan } from '../types';

/** One scan's report. Polls until the scan is completed or failed. Works without logging in. */
export const ScanReportPage = () => {
  const { uid = '' } = useParams();
  const navigate = useNavigate();

  const scanQuery = useQuery({
    queryKey: ['scan', uid],
    queryFn: () => scansApi.getScan(uid),
    refetchInterval: (query) =>
      isDone(query.state.data) ? false : POLL_INTERVAL_MS,
  });

  // scanning the same package and version again as a new scan
  const rescan = useMutation({
    mutationFn: scansApi.createScan,
    onSuccess: (scan) => navigate(`${ROUTES.scans}/${scan.uid}`),
    onError: notifyError,
  });
  const handleRescan = () => {
    if (!scanQuery.data) return;
    const { packageName, version } = scanQuery.data;
    rescan.mutate(version ? { packageName, version } : { packageName });
  };

  if (scanQuery.isPending) return <PageLoader />;

  if (scanQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(scanQuery.error)}
        onRetry={() => scanQuery.refetch()}
      />
    );
  }

  const scan = scanQuery.data;

  return (
    <Stack gap="lg" maw={1120} mx="auto">
      <PageTop
        title={
          scan.status === 'completed'
            ? 'Scan report'
            : `${scan.packageName}${scan.version ? `@${scan.version}` : ''}`
        }
        backBtn
      />
      {scan.status === 'completed' && (
        <ScanResult
          scan={scan}
          onRescan={handleRescan}
          rescanning={rescan.isPending}
        />
      )}
      {scan.status === 'failed' && (
        <ScanFailed
          scan={scan}
          onRetry={handleRescan}
          retrying={rescan.isPending}
        />
      )}
      {(scan.status === 'queued' || scan.status === 'running') && (
        <ScanPending scan={scan} />
      )}
    </Stack>
  );
};

const isDone = (scan?: Scan) =>
  scan?.status === 'completed' || scan?.status === 'failed';
