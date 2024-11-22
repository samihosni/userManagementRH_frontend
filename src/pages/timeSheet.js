

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Button,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';



import Sidebar from './sidebar';
import apiService from '../services/apiService';
import { ToastContainer, toast } from 'react-toastify';
const TimeSheetPage = () => {

    const [timesheets, setTimesheets] = useState([]);  // Stocker les feuilles de temps
    const [loading, setLoading] = useState(true);  // Indicateur de chargement
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getTimeSheet = async () => {
        try {
            const response = await apiService.get('timeSheet/all'); 
            console.log(response);
            if (response.data && Array.isArray(response.data)) {
                setTimesheets(response.data);
            } else {
                console.error('Unexpected response format');
            }
        }
        catch (err) {
            setError(err.message);  // Gérer les erreurs de l'appel API
        } 
    }

    useEffect(() => {
        getTimeSheet()
    }, []);

    const handleUpdateStatus = async (id, validated) => {
        if (!id) {
            console.error("ID is undefined or invalid!");
            return; // Stop execution if ID is missing
        }
        try {
            const response = await apiService.putTimeSheet(`timeSheet/${id}/validate`);
            console.log(response);
            if (response.status === 200) {
                setTimesheets((prevRequests) =>
                    prevRequests.map((req) =>
                    req.id === id ? { ...req, validated: true } : req
                ));
                toast.success('Time sheet validated successfully!!');
                setError(false);
            } else {
                toast.error('Failed to update status:', response.validated);
                setError(true);
            }
        } catch (error) {
            toast.error('Error updating status:', error);
            setError(true);
        }
    }

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

    const filteredRequests = timesheets.filter(
        (request) =>
          request.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) 
    );


    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <Box sx={{ width:'85%', height: '100%',  padding: 3 }}>
                {/* Header */}
                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        Time Sheet
                    </Typography>
                </Box>


                {/* Search Field */}
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <TextField
                    placeholder="Search something..."
                    variant="outlined"
                    size="small"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: "300px" }}
                    />
                    
                </Box>
                <Card>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Worked hours</TableCell>
                                <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {filteredRequests.length > 0 ? (
                                Array.isArray(filteredRequests) && filteredRequests.map((timesheet, index)=> (
                                <TableRow key={timesheet.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{timesheet.user.firstname}</TableCell>
                                    <TableCell>{timesheet.date}</TableCell>
                                    <TableCell>{timesheet.hoursWorked}</TableCell>
                                    <TableCell>
                                        <Button
                                        color="primary"
                                        onClick={() => handleUpdateStatus(timesheet.id, true)}
                                        disabled={timesheet.validated === true}
                                        >
                                        Validate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan={5}>No leave requests found</TableCell>
                            </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>
        </Box>
    );
}

export default TimeSheetPage;