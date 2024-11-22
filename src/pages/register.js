

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Link,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Alert,
    Grid
} from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';

const RegisterPage = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [role, setRole] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!firstname || !lastname || !email || !password || !role || !phone ) {
          setStatusMessage('All fields are required.');
          setError(true);
          return;
        }
        
        try {
            const createdDate = new Date().toISOString();
            const attributes = { firstname, lastname, email, password, role, phone, createdDate: createdDate };
            const response = await apiService.post('auth/register', attributes);
            console.log(firstname, lastname, email, password, role, phone, createdDate);
            console.log(response);
            
            if (response.status === 202) {
                setStatusMessage('Registration successful!');
                setError(false);
                navigate('/activate', { state: { message: `Registration completed! Please Activate your Account using MailDev.` } });
            } else {
                setStatusMessage('Registration failed. Please try again.');
                setError(true);
            }
        } catch (err) {
          setStatusMessage('An error occurred. Please check your inputs.');
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
            <Typography variant="h5"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: 2,
                  textAlign: 'center',
                }}
                >
                Register
            </Typography>
  
            {statusMessage && (
                <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
                {statusMessage}
                </Alert>
            )}
            <form onSubmit={handleRegister}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="FirstName"
                            variant="outlined"
                            fullWidth
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="LastName"
                            variant="outlined"
                            fullWidth
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="Phone"
                            margin="normal"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth >
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                label="Role"
                            >
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                <MenuItem value="HR">HR</MenuItem>
                                {/* <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem> */}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleRegister}
                        >
                        Register
                    </Button>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Already have an account?{' '}
                        <Link href="/login" underline="hover" sx={{ color: 'primary.main' }}>
                            Login
                        </Link>
                    </Typography>
                </Box>
                
            </form>

            {/* <div style={{display: "flex", alignItems:"center", justifyContent: "center" }}>
              {message && <p style={{ color: 'red', fontWeight: 'bold', textAlign: "center" }}>{message}</p>} 
            </div> */}
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  export default RegisterPage;