

import React, { useState, useEffect } from 'react';
import {
  Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Avatar,
    IconButton,
} from '@mui/material';

import Sidebar from './sidebar';
import apiService from '../services/apiService';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

const DashboardPage = () => {

  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Function to fetch the total number of users
    const fetchUserCount = async () => {
      try {
        const response =  await apiService.get('auth/users/count');
        console.log(response);
        
        setUserCount(response.data); // set the user count
      } catch (err) {
        setError("Failed to fetch user count");
        console.error(err);
      }
    };

    fetchUserCount();
  }, []);
  const getPerformanceClass = (performance) => {
    switch (performance) {
      case "Excellent":
        return { backgroundColor: '#5470c6', color: 'white', padding: '5px', borderRadius: '4px', fontWeight: 'bold' };
      case "Good":
        return { backgroundColor: '#91cc75', color: 'white', padding: '5px', borderRadius: '4px', fontWeight: 'bold' };
      case "Average":
        return { backgroundColor: '#fac858', color: 'black', padding: '5px', borderRadius: '4px', fontWeight: 'bold' };
      case "Weak":
        return { backgroundColor: '#ee6666', color: 'white', padding: '5px', borderRadius: '4px', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  
  

  const [employees, setEmployees] = useState([]);
    
  const getEmployee = async () => {
    try {
        const response = await apiService.get('evaluation/all'); 
        console.log(response); // Check the response structure
        if (response.data && Array.isArray(response.data)) {
            setEmployees(response.data);
        } else {
            console.error('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
  };

  // Use useEffect to fetch data on component mount
  useEffect(() => {
      getEmployee();
  }, []); //

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
      <Sidebar  />

      {/* Main Content */}
      <Box sx={{ width:'85%', height: '100%',  padding: 3 }}>
        {/* Header */}
        <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Dashboard
            </Typography>
        </Box>
        {/* Employee Summary Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={3}>
            <Card sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h6">Total Employee</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {userCount.nbTotal}
                </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h6">New Employee</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                10
                </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h6">Male</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {(userCount.nbTotal - 40)}
                </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h6">Female</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                40
                </Typography>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Card sx={{ flex: 1.2, height: '55vh', overflowY: 'scroll' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Employee Performance Table
              </Typography>
            </CardContent>
            <Divider sx={{ my: 0 }} />
            {/* Card Content: Pie Chart */}
            <CardContent>
              <TableContainer>
                  <Table>
                  <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Performance</TableCell>
                        {/* <TableCell>Performance Bar</TableCell> */}

                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {Array.isArray(employees) && employees.map((employee, index)=> (
                      <TableRow key={employee.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{employee.user.firstname}</TableCell>
                          <TableCell>{employee.score}</TableCell>
                          <TableCell>
                            <span style={getPerformanceClass(employee.feedback)}>
                              {employee.feedback}
                            </span>
                          </TableCell>
                          {/* <TableCell>
                          <div className="performance-bar">
                            <div className={`bar ${performanceColors[employee.feedback]}`} style={{ width: `${employee.feedback}%` }}></div>
                          </div>
                          </TableCell> */}
                      </TableRow>
                      ))}
                  </TableBody>
                  </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card sx={{ flex: 0.7, height: '55vh', }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Feedback Overview
              </Typography>
            </CardContent>
            <Divider sx={{ my: 1 }} />
            {/* Card Content: Pie Chart */}
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <PieChart />
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ marginTop: 3 }}>
        <CardContent>
              <Typography variant="h5" component="div">
                Employee Performance Score
              </Typography>
            </CardContent>
              <Divider sx={{ my: 0 }} />
            {/* Card Content: Pie Chart */}
            <CardContent>
              <BarChart />
            </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardPage;