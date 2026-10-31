import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, {
  clearSession,
  setSession,
} from '@/features/auth/store/authSlice';
import { configureInterceptor } from '@/shared/api/interceptor';

const rootReducer = combineReducers({ auth: authReducer });

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

/** When the refresh fails, the session is cleared; the route guards then send the user to login. */
configureInterceptor({
  getToken: () => store.getState().auth.accessToken,
  onSession: (payload) => store.dispatch(setSession(payload)),
  onLogout: () => store.dispatch(clearSession()),
});
