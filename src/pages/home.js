

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';

import Sidebar from './sidebar';

const HomePage = () => {

  const userRole = 'ADMIN' || 'HR'

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
      // Get name and role from localStorage
      const storedName = localStorage.getItem("name");
      const storedRole = localStorage.getItem("role");
      const storedId = localStorage.getItem("id");

      setName(storedName || "Unknown");
      setRole(storedRole || "Unknown");
      setId(storedId || "Unknown");
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Component */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <h1>Welcome to the Home</h1>
        <p>User is not authenticated Or User doesn't have the correct role!</p>
      </Box>
    </Box>
  );
}

export default HomePage;