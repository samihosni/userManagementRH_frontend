

import React, { useState, useEffect } from 'react';
import {
  
  Typography,
  TextField,
  Button,
  Card,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import Sidebar from './sidebar';
import apiService from '../services/apiService';



const HolidayEmpPage = () => {

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

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [holidayEntries, setHolidayEntries] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleSubmit = async () => {
        
        if (!startDate || !endDate || !reason || !file) {
            console.log("All fields are required, including the file.");
            
            setDialogMessage('All fields are required, including the file.');
            setDialogOpen(true);
            return;
        }

        const newEntry =  {
            user: {
                id: id
            },
            startDate: startDate,
            endDate: endDate,
            reason: reason,
            status: 'Pending'
        };
        console.log(newEntry);
        
        try {

            const formData = new FormData();
            formData.append('holidayRequest', JSON.stringify(newEntry));
            formData.append('file', file);

            await apiService.postHolidayRequest('holidayRequest/add', formData);
            setHolidayEntries([...holidayEntries, newEntry]);
            setDialogMessage('Holiday request submitted successfully!');
            setDialogOpen(true);
            setStartDate('');
            setEndDate('');
            setReason('');
            setFile(null);
            
        } catch (error) {
            setDialogMessage('Failed to submit holiday request.');
            setDialogOpen(true);
        }
        
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    /////////////////////////////////////////////////////////

    
    

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                Employee Holiday
                </Typography>

                {/* Holiday Request Form */}
                <Card sx={{
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#f9f9f9",
                    marginBottom: 4,
                }}
                >
                
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            label="Reason"
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label">
                                Upload Supporting Document
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            {file && <Typography>Selected File: {file.name}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            ADD +
                        </Button>
                        </Grid>
                    </Grid>
                </Card>

                
            </Box>

            {/* Dialog for Success/Failure Messages */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Holiday Request</DialogTitle>
                <DialogContent>
                <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    OK
                </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default HolidayEmpPage;