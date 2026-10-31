import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthPayload, AuthUser } from '@/shared/api/types';

/** loading: checking for a session on page load. */
export type AuthStatus = 'loading' | 'authenticated' | 'guest';

/** Kept in memory only. A page reload gets a new access token with the refresh cookie. */
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<Pick<AuthPayload, 'user' | 'accessToken'>>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
    },
    /** After the user verifies their email. */
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'guest';
    },
  },
});

export const { setSession, setUser, clearSession } = authSlice.actions;
export default authSlice.reducer;
