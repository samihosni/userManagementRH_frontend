

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider
} from '@mui/material';

import Sidebar from './sidebar';

import apiService from '../services/apiService';

import { PDFExport } from '@progress/kendo-react-pdf';
import * as XLSX from 'xlsx';

const ReportPage = () => {

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


    const pdfExportComponent = useRef();

    // Export to Excel (XLSX)
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(employees);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees Performance');
        XLSX.writeFile(wb, 'employees_performance.xlsx');
    };

    // Export to CSV
    const handleExportCSV = () => {
        const ws = XLSX.utils.json_to_sheet(employees);
        const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'employees_performance.csv';
        link.click();
    };

    // Export to PDF using KendoReact PDFExport
    const handleExportPDF = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save(); 
        }
    };

    return (
        <Box sx={{ display: 'flex' , overflowX: 'hidden'}}>
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ width:'85%', height: '100%',  padding: 3 }}>
                    {/* Header */}
                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        Reports
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
                        {/* <button onClick={handleExportExcel}>Export to Excel</button>
                        <button onClick={handleExportCSV}>Export to CSV</button>
                        <button onClick={handleExportPDF}>Export to PDF</button> */}

                        <button onClick={handleExportExcel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <img src="xlsx1.png" alt="Export to Excel" style={{ width: 40, height: 40 }} />
                        </button>
                        <button onClick={handleExportCSV} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <img src="csv.png" alt="Export to CSV" style={{ width: 40, height: 40 }} />
                        </button>
                        <button onClick={handleExportPDF} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <img src="pdf.png" alt="Export to PDF" style={{ width: 50, height: 50 }} />
                        </button>
                    </Box>
                    <PDFExport ref={pdfExportComponent} paperSize="auto" >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Card sx={{ width: '88vw' }}>
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
                                            
                        </Box>
                    </PDFExport>
                </Box>

            </Box>
        </Box>
    );
}

export default ReportPage;