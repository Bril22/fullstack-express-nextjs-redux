import { createAction } from '@reduxjs/toolkit';
import { User } from '@ebuddy/models'

export const setUser = createAction<User | null>('auth/setUser');
export const setLoading = createAction<boolean>('auth/setLoading');
export const isAuthenticated = createAction<boolean>('auth/isAuthenticated');
export const setError = createAction<string | null>('auth/setError');
export const logout = createAction('auth/logout');

export const fetchUserData = createAction<User | null>('auth/fetchUserData');
