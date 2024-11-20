'use client'
import { fetchUserData, setError } from "@/store/action";
import { RootState } from "@/store/store";
import { ResponseInterface, User } from "@ebuddy/models";
import { Box, Button, Card, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserDisplay = () => {
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');
    const fetchData = useSelector((state: RootState) => state.auth.fetchUserData);
    // console.log('user', user)

    const handleFetchData = async () => {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetch-user-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
            },
        })
        const response: ResponseInterface<User> = await data.json();
        if (response?.data?.data && response.statusCode === 200) {
            dispatch(fetchUserData(response?.data?.data));
        } else {
            console.log('respnse', response)
            setErrorMessage(response?.message);
            dispatch(setError(response?.message))
        }
    }

    const handleCloseData = () => {
        dispatch(fetchUserData(null));
        setErrorMessage('');
    }

    useEffect(() => {
        setErrorMessage('');
    }, []);
    return (
        <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'start'} gap={4}>
                <Button variant="outlined" color="primary" onClick={handleFetchData} style={{ height: '40px', width: '180px' }}>
                    Fetch Data
                </Button>
                {fetchData && (
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    User Information
                                </Typography>
                                <Box display={'flex'} flexDirection={'column'} gap={1}>
                                    <Typography variant="caption">Name: {fetchData?.name}</Typography>
                                    <Typography variant="caption">Email: {fetchData?.email}</Typography>
                                    <Typography variant="caption">Phone: {fetchData?.phone}</Typography>
                                </Box>

                            </CardContent>
                        </Card>
                        <Button variant="contained" color="error" onClick={handleCloseData} style={{ width: '40px' }}>
                            X
                        </Button>
                    </>
                )}
            </Box>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </Box>
    )
}

export default UserDisplay;