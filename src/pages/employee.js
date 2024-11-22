

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
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';

import Sidebar from './sidebar';

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from '../services/apiService';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

const EmployeePage = () => {
    
    //get
    const [employees, setEmployees] = useState([]);
    
    const getEmployee = async () => {
        try {
            const response = await apiService.get('auth/users'); 
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

    useEffect(() => {
        getEmployee();
    }, []); 


    //addd

    const createdDate = new Date().toISOString();

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [activateDialogOpen, setActivateDialogOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        createdDate: createdDate
    });
    const handleAddEmployee = async () => {
        try {
            const response = await apiService.post('auth/register', newEmployee); // Adjust endpoint as needed
            if (response.status === 202) {
                setAddDialogOpen(false);
                setActivateDialogOpen(true);
            } else {
                console.error("Failed to add employee");
            }
        } catch (err) {
            console.error("Error adding employee:", err);
        }
    };

    //activation
    const [activationDialogOpen, setActivationDialogOpen] = useState(false);
    const [token, setActivationToken] = useState('');
    const [activationStatus, setActivationStatus] = useState('');
    const [error, setError] = useState(false);
    const handleActivateAccount = async () => {
        if (!token) {
          setActivationStatus('Token is required.');
          setError(true);
          return;
        }
    
        try {
            const response = await apiService.get('auth/activate-account', { token });
            console.log(response);
            
            if (response.status === 200) {
                toast.success('Account activated successfully!');
                setError(false);
                setActivateDialogOpen(false);
            } else {
                toast.error('Activation failed. Please try again.');
                setError(true);
            }
        } catch (err) {
            toast.error('An error occurred during activation.');
            setError(true);
        }
      };

    
    const [viewEmployeeDialog, setViewEmployeeDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); 
    const [openDialog, setOpenDialog] = useState(false); 

    const [editDialogOpen, setEditDialogOpen] = useState(false); 
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    //details
    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setViewEmployeeDialog(true); 

    };

    //edit
    const handleEdit = (employee) => {
        setCurrentEmployee(employee); // Set the employee being edited
        setEditDialogOpen(true); // Open the edit dialog
    };

    const handleSaveEdit = async () => {
        try {
            console.log(currentEmployee);

            currentEmployee.lastModifiedDate = new Date().toISOString();
            const response = await apiService.put(`auth/updateUsers/${currentEmployee.id}`, currentEmployee);
            console.log(currentEmployee);
            
            console.log(response);
            
            if (response.status === 200) {
                setEmployees(employees.map((emp) =>
                    emp.id === currentEmployee.id ? currentEmployee : emp
                    
                ));
                setEditDialogOpen(false);
                toast.success("Employee updated successfully!");
            } else {
                toast.error("Failed to update employee");
            }
        } catch (error) {
            toast.error("Error occurred while updating the employee.");
        }
    };

    //delete
    const handleDelete = async (employeeId) => {
        
        try {
            const response = await apiService.delete(`auth/users/${employeeId}`);
            console.log(response);
            
            if (response.status === 200) {
                // Remove the deleted employee from the state
                setEmployees(employees.filter((emp) => emp.id !== employeeId));
                setOpenDialog(false);
                toast.success("Employee deleted successfully!");
            } else {
                toast.error("Failed to delete employee");
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error("Error occurred while deleting the employee.");
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

    //search
    const filteredRequests = employees.filter(
        (request) =>
        request.firstname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Component */}
            <Sidebar  />

            {/* Main Content */}
            <Box sx={{ width:'85%', height: '100%',  padding: 3 }}>
                {/* Header */}
                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Employee List
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
                    <Button variant="contained" color="primary" onClick={() => setAddDialogOpen(true)}>
                    + Add
                    </Button>
                </Box>

                {/* Employee Table */}
                <Card>
                    <TableContainer>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>FirstName</TableCell>
                            <TableCell>LastName</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Join Date</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {filteredRequests.length > 0 ? (
                            Array.isArray(filteredRequests) && filteredRequests.map((employee, index)=> (
                            <TableRow key={employee.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Avatar sx={{ marginRight: 2 }}>{employee.name[0].toUpperCase()}</Avatar>
                                    <Box>
                                        <Typography>{employee.firstname}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {employee.firstname}
                                        </Typography>
                                    </Box>
                                </Box>
                                </TableCell>
                                <TableCell>{employee.lastname}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.createdDate }</TableCell>
                                <TableCell>{employee.roles[0].name}</TableCell>
                                <TableCell>
                                
                                    <IconButton onClick={() => handleView(employee)}>
                                        <VisibilityIcon />
                                    </IconButton>

                                    <IconButton onClick={() => handleEdit(employee)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => setOpenDialog(employee.id)}>
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                              <TableCell colSpan={8}>No leave requests found</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={Boolean(openDialog)}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this employee?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            color="error"
                            onClick={() => {
                            handleDelete(openDialog);
                            setOpenDialog(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* edit Dialog */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                    <DialogTitle>Edit Employee Details</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="FirstName"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={currentEmployee?.firstname || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, firstname: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="LastName"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={currentEmployee?.lastname || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, lastname: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={currentEmployee?.email || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Password"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={currentEmployee?.password || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, password: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <TextField
                                    label="Phone"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={currentEmployee?.phone || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <FormControl fullWidth >
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={currentEmployee?.roles[0].name || ''}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
                                        label="Role"
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="HR">HR</MenuItem>
                                        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                                    </Select>
                                </FormControl>
                                
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSaveEdit} color="primary"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* View Employee Details Dialog */}
                <Dialog open={viewEmployeeDialog} onClose={() => setViewEmployeeDialog(false)}>
                    <DialogTitle>Employee Details</DialogTitle>
                    <DialogContent>
                        {selectedEmployee && (
                            <Box>
                                <Typography variant="h6">Name: {selectedEmployee.name}</Typography>
                                <Typography variant="body1">Email: {selectedEmployee.email}</Typography>
                                <Typography variant="body1">Phone: {selectedEmployee.phone}</Typography>
                                <Typography variant="body1">Join Date: {selectedEmployee.joinDate}</Typography>
                                <Typography variant="body1">Role: {selectedEmployee.role}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewEmployeeDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/*Add dialog*/}   
                <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="FirstName"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={newEmployee.firstname}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, firstname: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="LastName"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={newEmployee.lastname}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, lastname: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Password"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    type="password"
                                    value={newEmployee.password}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={newEmployee.role}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                        label="Role"
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="HR">HR</MenuItem>
                                        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => handleAddEmployee()}
                            color="primary"
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={activateDialogOpen} onClose={() => setActivateDialogOpen(false)}>
                    <DialogTitle>Activate Account</DialogTitle>
                    <DialogContent>
                        <Typography>
                            The employee has been successfully added. Please activate the account using MailDev.

                        </Typography>
                        {activationStatus && (
                            <Typography color={error ? 'error' : 'success'} variant="body2">
                            {activationStatus}
                            </Typography>
                        )}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Activation Token"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={token}
                                    onChange={(e) => setActivationToken(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    onClick={handleActivateAccount}
                                >
                                    Activate Account
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setActivateDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default EmployeePage;