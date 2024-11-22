

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';

import Sidebar from './sidebar';

const DashboardEmpPage = () => {

    const profile = {
        name: "John Doe",
        role: "Software Developer",
        department: "IT",
    };

    const holidays = [
        { name: "New Year's Day", date: "2024-01-01" },
        { name: "Labor Day", date: "2024-05-01" },
    ];

    const timesheets = [
        { date: "2024-11-01", start: "09:00", end: "17:00", hours: 8 },
        { date: "2024-11-02", start: "09:00", end: "16:30", hours: 7.5 },
    ];

    const notifications = [
        "Your leave request has been approved.",
        "Submit your timesheet for the current week.",
    ];

    const userRole = 'EMPLOYEE'

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
            <Box
            sx={{
                padding: 4,
                bgcolor: "#f0f2f5",
                minHeight: "100vh",
            }}
            >
                {/* Header */}
                <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center" }}>
                    Welcome, {name}!
                </Typography>

                {/* Main Dashboard Content */}
                <Grid container spacing={3}>
                    {/* Profile Overview */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ padding: 2 , height:'90%'}}>
                            <CardContent>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Profile Overview
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    sx={{
                                    bgcolor: "#1976d2", // Background color of the avatar
                                    width: 100, // Avatar size
                                    height: 100,
                                    fontSize: 40, // Font size for the letter
                                    }}
                                >
                                    {name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography>Name: {name}</Typography>
                                    <Typography>Role: {role} : {profile.role}</Typography>
                                    <Typography>Department: {profile.department}</Typography>
                                </Box>
                            </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Holidays */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ padding: 2, height:'90%' }}>
                            <CardContent>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Holidays
                            </Typography>
                            <ul>
                                {holidays.map((holiday, index) => (
                                <li key={index}>
                                    {holiday.name}: {holiday.date}
                                </li>
                                ))}
                            </ul>
                            {/* <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                fullWidth
                            >
                                Request Holiday
                            </Button> */}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Notifications */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ padding: 2, height:'90%'}}>
                            <CardContent>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Notifications
                            </Typography>
                            <ul>
                                {notifications.map((note, index) => (
                                <li key={index}>{note}</li>
                                ))}
                            </ul>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Timesheet */}
                    <Grid item xs={12}>
                    <Card sx={{ padding: 2 }}>
                        <CardContent>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Timesheet
                        </Typography>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Total Hours</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {timesheets.map((entry, index) => (
                                <TableRow key={index}>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{entry.start}</TableCell>
                                <TableCell>{entry.end}</TableCell>
                                <TableCell>{entry.hours}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 }}
                            fullWidth
                        >
                            Submit Timesheet
                        </Button> */}
                        </CardContent>
                    </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default DashboardEmpPage;