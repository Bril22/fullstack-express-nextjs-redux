'use client'
import { Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/apis/firebase";
import { isAuthenticated, logout, setUser } from "@/store/action";
import { jwtDecode } from "jwt-decode";
import { User } from "@ebuddy/models";
import UserForm from "@/components/user-data-form";
import UserDisplay from "@/components/user-data-display";
export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log('user', user)
  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      const decode = jwtDecode(token) as User;
      if (decode) {
        dispatch(setUser(decode));
      }
      // console.log('decode', JSON.stringify(decode))
      dispatch(isAuthenticated(true))
    } else if (typeof window !== 'undefined' && !token) {
      redirect('/login');
    }
  }, [dispatch]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch(logout());
      localStorage.removeItem('idToken');
      router.push('/login');
    });
  };

  return (
    <Box padding={4} display={'flex'} flexDirection={'column'} gap={4}>
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <Typography variant="h5">Welcome <span style={{ fontWeight: 'bolder' }}>{user?.email ?? 'User Name'}</span></Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Divider>Demo Fetch Data</Divider>
      <UserDisplay />
      <Divider>Demo Update Data</Divider>
      <UserForm />
    </Box>
  );
}
