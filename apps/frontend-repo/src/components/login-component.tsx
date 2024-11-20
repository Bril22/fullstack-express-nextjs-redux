'use client'
import { auth, FirebaseAuthError } from '@/apis/firebase';
import { login } from '@/apis/userApi';
import { GoogleIcon } from '@/icon';
import { setLoading, setUser, setError, isAuthenticated } from '@/store/action';
import { RootState } from '@/store/store';
import { Card, SignInContainer } from '@/theme/AppTheme';
import { Box, TextField, Button, Typography, CircularProgress, Divider } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
export const LoginComponent = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()
    const loading = useSelector((state: RootState) => state.auth.loading);

    const handleLogin = async () => {
        dispatch(setLoading(true));
        try {
            const response = await login({ email, password });
            if (!response?.data?.user) {
                throw new Error('User not found');
            }
            // console.log('response: ' + JSON.stringify(response))
            const idToken = await response?.data?.user?.getIdToken();
            localStorage.setItem('idToken', idToken);
            dispatch(setUser({ email: response?.data?.user?.email!, id: response?.data?.user?.uid! }));
            dispatch(isAuthenticated(true))
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                dispatch(setError(error.code));
                setErrorMessage(FirebaseAuthError(error.code));
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGoogleLogin = async () => {
        dispatch(setLoading(true));
        try {
            const user = await signInWithPopup(auth, new GoogleAuthProvider())
            if (!user?.user) {
                throw new Error('Failed to login with Google');
            }
            const idToken = await user?.user?.getIdToken();
            localStorage.setItem('idToken', idToken);
            dispatch(setUser({ email: user?.user?.email!, id: user?.user?.uid! }));
            dispatch(isAuthenticated(true))
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                dispatch(setError(error.code));
                setErrorMessage(FirebaseAuthError(error.code));
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        setErrorMessage('');
        setEmail('');
        setPassword('');
    }, []);

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    {`Sign in`}
                </Typography>
                {/* <Box padding={5}> */}
                <Box
                    component="form"
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        {/* Login */}
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                </Box>
                <Divider>or</Divider>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={<GoogleIcon />}
                >
                    {`Sign in with Google`}
                </Button>
                {/* </Box> */}
            </Card>
        </SignInContainer>
    );
}
