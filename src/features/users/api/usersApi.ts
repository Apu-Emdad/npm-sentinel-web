import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type { User, UsersFiltersState, UsersList } from '../types';

export const usersApi = {
  getUsers: async (params: UsersFiltersState) =>
    (await axios.get<Result<UsersList>>('/users', { params })).data.data,

  getUser: async (uid: string) =>
    (await axios.get<Result<User>>(`/users/${uid}`)).data.data,

  deactivateUser: async (uid: string) =>
    (await axios.patch<Result>(`/users/deactivate/${uid}`)).data,

  deleteUser: async (uid: string) =>
    (await axios.delete<Result>(`/users/${uid}`)).data,
};
