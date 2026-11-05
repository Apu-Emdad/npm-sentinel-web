import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type {
  BulkScan,
  CreateBulkScanBody,
  CreateScanBody,
  CreatedBulkScan,
  CreatedScan,
  Scan,
} from '../types';

export const scansApi = {
  createScan: async (body: CreateScanBody) =>
    (await axios.post<Result<CreatedScan>>('/scans', body)).data.data,

  getScan: async (uid: string) =>
    (await axios.get<Result<Scan>>(`/scans/${uid}`)).data.data,

  createBulkScan: async (body: CreateBulkScanBody) =>
    (await axios.post<Result<CreatedBulkScan>>('/scans/bulk', body)).data.data,

  getBulkScan: async (uid: string) =>
    (await axios.get<Result<BulkScan>>(`/scans/bulk/${uid}`)).data.data,
};
