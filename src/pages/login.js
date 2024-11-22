

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Link, 
  Alert
} from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';

const LoginPage = () => {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
  
    const handleLogin = async (event) => {

      event.preventDefault();

      window.history.replaceState({}, document.title);

      console.log('Username:', email, 'Password:', password);
      if(email === "" ||  password === "")
      {
        setStatusMessage('All fields are required.');
        setError(true);
        return;
      }
      try {
        // Use the service to make a POST request
        const response = await apiService.post('auth/authenticate', { email, password });
        console.log(response);
        
        if (response.data.token) {

          const userRole = response.data.role; // Assuming the backend sends the user's role
          console.log('User Role:', userRole);

          const userName = response.data.fullName; // Assuming the backend sends the user's role
          console.log('User Name:', userName);

          const userId = response.data.userId; // Assuming the backend sends the user's role
          console.log('User Id:', userId);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", userName);
          localStorage.setItem("role", userRole);
          localStorage.setItem("id", userId);


          // Navigate based on the user's role
          if (userRole === 'HR') {
            navigate('/dashboard');
          } else if (userRole === 'ADMIN') {
            navigate('/dashboard');
          } else if (userRole === 'EMPLOYEE') {
            navigate('/dashboardEmp');
          }
        } else {
          setStatusMessage(response.data.message || 'Invalid username or password');
          setError(true);
        }
      } catch (error) {
        console.error('Login error:', error);
        setStatusMessage('An error occurred during login. Please try again.');
        setError(true);
      }
    };

    const location = useLocation();
    useEffect(() => {
      const message = location.state?.message; 
      if (message) {
        setStatusMessage(message);
        console.log(message);
        
        if (message.toLowerCase().includes('successfully')) {
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
                Login to your account
            </Typography>
  
            {statusMessage && (
                <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
                {statusMessage}
                </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                 
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Don't have an account?{' '}
                    <Link href="/register" underline="hover" sx={{ color: 'primary' }}>
                      Register
                    </Link>
                  </Typography>
                </Box>
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
  
  export default LoginPage;