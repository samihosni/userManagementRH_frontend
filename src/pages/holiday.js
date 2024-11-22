

import React, { useState, useEffect } from 'react';
import {
  
  Typography,
  TextField,
  Button,
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';

import Sidebar from './sidebar';
import apiService from '../services/apiService';



const HolidayPage = () => {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getHolidays = async () => {

        try {
            const response = await apiService.get('holidayRequest/all'); 
            console.log(response); 
            if (response.data && Array.isArray(response.data)) {
                
                setLeaveRequests(response.data);
            } else {
                console.error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    }
    useEffect(() => {
        getHolidays();
        // const staticLeaveRequests = getHolidays();
        // setLeaveRequests(staticLeaveRequests);
    }, []);

    const handleUpdateStatus = async (id, status) => {
        if (!id) {
            console.error("ID is undefined or invalid!");
            return; // Stop execution if ID is missing
        }
        try {
            // Make API call to update the status
            const response = await apiService.put(`holidayRequest/update/${id}`, { status });
            
            // Log the response for debugging
            console.log(response);

            // Check if the response indicates a successful update
            if (response.status === 200) {
                // Update the local state to reflect the change
                setTimeout(() => {
                    setLeaveRequests((prevRequests) =>
                        prevRequests.map((req) =>
                            req.id === id ? { ...req, status } : req
                        )
                    );
                }, 500);
                
            } else {
                console.error('Failed to update status', response);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

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

    const filteredRequests = leaveRequests.filter(
        (request) =>
          request.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex' }}>
        {/* Sidebar Component */}
        <Sidebar />


            <Box sx={{ width:'85%', height: '100%',  padding: 3 }}>

                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Holiday List
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
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date </TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Leave balance</TableCell> 
                                <TableCell>Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {filteredRequests.length > 0 ? (
                                Array.isArray(filteredRequests) && filteredRequests.map((request, index) => (
                                <TableRow key={request.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{request.user.firstname}</TableCell>
                                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell> 12 Days</TableCell>
                                    <TableCell>
                                        <Button
                                        color="primary"
                                        onClick={() => handleUpdateStatus(request.id, 'Approved')}
                                        disabled={request.status !== 'Pending'}
                                        >
                                        Approved
                                        </Button>
                                        <Button
                                        color="secondary"
                                        onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                        disabled={request.status !== 'Pending'}
                                        >
                                        Rejected
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7}>No leave requests found</TableCell>
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

export default HolidayPage;