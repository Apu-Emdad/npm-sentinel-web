import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type { CreateScanBody, CreatedScan, Scan } from '../types';

export const scansApi = {
  createScan: async (body: CreateScanBody) =>
    (await axios.post<Result<CreatedScan>>('/scans', body)).data.data,

  getScan: async (uid: string) =>
    (await axios.get<Result<Scan>>(`/scans/${uid}`)).data.data,
};
