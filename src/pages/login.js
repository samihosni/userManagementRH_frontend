

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = (event) => {
      event.preventDefault();
      // Perform authentication logic here
      console.log('Username:', username, 'Password:', password);
      if(username === "" ||  password === "")
      {
        alert('Remplir les champs');
      }
      else if (username === 'user' && password === 'user') {
        navigate('/home');
      } else {
        alert('Invalid username or password');
      }
    };
  
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f0f2f5"
      >
        <Card sx={{ width: 400, padding: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Login
            </Typography>
  
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username}
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
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  export default LoginPage;