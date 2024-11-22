import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Alert } from '@mui/material';
import apiService from '../services/apiService'; // Service for backend API calls
import { useLocation, useNavigate } from 'react-router-dom';

const ActivateAccountPage = () => {
    const [token, setToken] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleActivate = async () => {
        if (!token) {
        setStatusMessage('Token is required.');
        setError(true);
        return;
        }

        try {
            const response = await apiService.get('auth/activate-account', { token });
            setStatusMessage(response.data || 'Account activated successfully!');
            setError(false);
            navigate('/', { state: { message: 'Account activated successfully! Please log in' } });
        } catch (err) {
            console.error(err);
            setStatusMessage(err.response?.data || 'An error occurred while activating the account.');
            setError(true);
        }
    };

    const location = useLocation();
    useEffect(() => {
      const message = location.state?.message; 
      if (message) {
        setStatusMessage(message);
        console.log(message);
        
        if (message.toLowerCase().includes(('completed') || ('successfully'))) {
          setError(false); // Success case
        } else {
          setError(true); // Error case
        }

        window.history.replaceState({}, document.title);

      }
    }, [location.state]);
    return (
        <Box 
            sx={{
            height: '100vh',
            
            display: 'flex',
            bgcolor: "#f0f2f5",
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/auth_bg3.jpg)', // Add your background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '0 6%'
            }}
        >
            <Card sx={{
            
                width: '40%',
                padding: 4,
                borderRadius: 4,
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
            }}>
            <CardContent>
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 3, // Space below the logo
                }}
                >
                <img
                    src="/logo.png" // Replace with your logo path
                    alt="Logo"
                    style={{ height: '100px', width: 'auto' }} // Adjust size as needed
                />
                </Box>
                <Typography ariant="h5"
                    sx={{
                    fontWeight: 'bold',
                    marginBottom: 2,
                    textAlign: 'center',
                    }}
                >
                    Activate Your Account
                </Typography>
                {statusMessage && (
                <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
                {statusMessage}
                </Alert>
                )}
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="Activation Token"
                            variant="outlined"
                            margin="normal"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleActivate}
                        >
                            Activate Account
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        </Box>
    );
};

export default ActivateAccountPage;