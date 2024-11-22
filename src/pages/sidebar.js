import React, { useState, useEffect } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReportIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const Sidebar = () => {

  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // Retrieve the user's role from localStorage (or your authentication source)
    const storedRole = localStorage.getItem("role"); // Ensure the role is stored in localStorage during login
    setRole(storedRole || "EMPLOYEE"); // Default to "employee" if no role is found
  }, []);

  const employeeLinks = [
    { text: "Dashboard", icon: <DashboardIcon /> , path: "/dashboardEmp" },
    { text: "Timesheet", icon: <EventIcon />, path: "/timeSheetEmp" },
    { text: "Holidays", icon: <CalendarTodayIcon />,  path: "/holidayEmp" },
    { text: "Profile", icon: <PeopleIcon />},
  ];

  const hrLinks = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Employee Management", icon: <PeopleIcon />, path: "/employee" },
    { text: 'Holidays', icon: <CalendarTodayIcon />, path: '/holiday' },
    { text: 'Time Sheet', icon: <EventIcon />, path: '/timeSheet' },
    { text: "Reports", icon: <ReportIcon />, path: '/report' },
  ];

  const links = ( (role === "ADMIN" || role === "HR") ) ? hrLinks : employeeLinks;

  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "20%",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: "20%", boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column',  alignItems: 'center', padding: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            style={{ height: '50px', width: 'auto' }} // Adjust size as needed
          />
        </Box>
        <Typography variant="h5" fontWeight={'bold'}>
           Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {links.map((item, index) => (
          <ListItem button key={index} component={Link} to={item.path}
                    sx={{
                      borderRadius: "0 20px 20px 0",
                      backgroundColor: location.pathname === item.path ? "rgba(72, 78, 122, 0.2)" : "transparent", 
                      "&:hover": {
                        backgroundColor: "rgba(72, 78, 122, 0.1)", // Hover effect
                      },
                    }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText fontWeight={'bold'} color="primary" primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => {
          localStorage.removeItem("role");
          navigate("/");
        }}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;