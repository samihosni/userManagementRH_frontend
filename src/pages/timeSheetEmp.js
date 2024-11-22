

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import Sidebar from './sidebar';
import apiService from '../services/apiService';

const TimeSheetEmpPage = () => {

    const userRole = 'EMPLOYEE'

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        // Get name and role from localStorage
        const storedName = localStorage.getItem("name");
        const storedRole = localStorage.getItem("role");
        const storedId = localStorage.getItem("id");

        console.log(storedId, storedName, storedRole);
        
        setName(storedName || "Unknown");
        setRole(storedRole || "Unknown");
        setId(storedId || "Unknown");

        if (storedId) {
            fetchTimesheetEntries(storedId);
        }

    }, []);

    const [task, setTask] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [timesheetEntries, setTimesheetEntries] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    
    const fetchTimesheetEntries = async (userId) => {
        try {
          const response = await apiService.get(`timeSheet/${userId}`);;
          setTimesheetEntries(response.data);  // Assuming the response contains an array of timesheet entries
        } catch (error) {
          console.error('Error fetching timesheet entries:', error);
          // Handle error (e.g., show a notification to the user)
        }
    };

    const handleAddEntry = async () => {

        if (!hoursWorked ) {
            console.log("All fields are required.");
            
            setDialogMessage('All fields are required.');
            setDialogOpen(true);
            return;
        }

        
        const newEntry = {
            //task: task,
            user: {
                id: id
            },
            hoursWorked: hoursWorked,
            date: new Date().toLocaleDateString('en-CA'),
        };
        
        try {
            // Call the API to save the new entry to the database
            await apiService.post('timeSheet/add', newEntry);
    
            // Add entry to local state (UI update)
            setTimesheetEntries([...timesheetEntries, newEntry]);
    
            // Clear input fields after saving
            setHoursWorked('');
            // setTask('');
        } catch (error) {
            console.error('Error saving timesheet entry:', error);
            // Handle error (e.g., show a notification to the user)
        }
        
    }
    
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: "100vh"  }}>
            {/* Sidebar Component */}
            <Sidebar  />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Employee Holiday
                </Typography>
                <Card sx={{
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#f9f9f9",
                    marginBottom: 4,
                }}>
                    <Grid container spacing={3}>
                        

                        {/* Hours Worked Input */}
                        <Grid item xs={12} md={6}>
                            <TextField
                            label="Hours Worked"
                            variant="outlined"
                            type="number"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(e.target.value)}
                            />
                        </Grid>
                        {/* Button to add the entry */}
                        <Grid item xs={12} md={6}>
                            <Button variant="contained" color="primary" onClick={handleAddEntry}>
                            Add +
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* List of Timesheet Entries */}
                    <Typography variant="h6" gutterBottom>
                        Timesheet List
                    </Typography>
                    <List>
                        {timesheetEntries.length === 0 ? (
                        <Typography>No entries yet.</Typography>
                        ) : (
                        timesheetEntries.map((entry, index) => (
                            <ListItem key={index}>
                            <ListItemText
                                primary={`${name} - ${entry.hoursWorked} hours`}
                                secondary={`Date: ${entry.date}`}
                            />
                            </ListItem>
                        ))
                        )}
                    </List>
                </Card>
            </Box>

            {/* Dialog for Success/Failure Messages */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>TimeSheet Request</DialogTitle>
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

export default TimeSheetEmpPage;