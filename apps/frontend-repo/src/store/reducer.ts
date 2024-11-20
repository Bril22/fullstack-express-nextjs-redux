import { createReducer } from '@reduxjs/toolkit';
import { setUser, setLoading, setError, logout, isAuthenticated, fetchUserData } from './action';
import { User } from '@ebuddy/models';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  fetchUserData: User | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  fetchUserData: null
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(isAuthenticated, (state, action) => {
      state.isAuthenticated = action.payload;
    })
    .addCase(logout, (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    })
    .addCase(fetchUserData, (state, action) => {
      state.fetchUserData = action.payload;
    });
});

export default authReducer;
