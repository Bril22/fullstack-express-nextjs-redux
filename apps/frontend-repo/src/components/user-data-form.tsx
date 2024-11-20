'use client'
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchUserData, setError } from '@/store/action';
import { ResponseInterface, User } from '@ebuddy/models';

const UserForm = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState<String>('');
    const [email, setEmail] = useState<String>('');
    const [phone, setPhone] = useState<String>('');
    const [errorMessage, setErrorMessage] = useState<String>('');
    const [success, setSuccess] = useState<String>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        const payload = {
            name,
            email,
            phone,
        } as User;
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update-user-data`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
            },
            body: JSON.stringify(payload),
        });

        const response: ResponseInterface<User> = await data.json();
        if (response?.data?.data && response.statusCode === 200 || 201) {
            dispatch(fetchUserData(response?.data?.data!));
            setName('');
            setEmail('');
            setPhone('');
            setSuccess(response?.message)
        } else {
            console.log('respnse', response)
            setErrorMessage(response?.message);
            dispatch(setError(response?.message))
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} padding={4} display="flex" flexDirection="column" gap={2} width={'50%'}>
            <Typography variant="h6">Create User</Typography>
            <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Phone"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {success && <Typography color="success">{success}</Typography>}
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

export default UserForm;