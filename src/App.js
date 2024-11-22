// import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import DashboardPage from './pages/dashboard';
import EmployeePage from './pages/employee';
import HolidayPage from './pages/holiday';
import TimeSheetPage from './pages/timeSheet';
import DashboardEmpPage from './pages/dashboardEmp';
import HolidayEmpPage from './pages/holidayEmp';
import TimeSheetEmpPage from './pages/timeSheetEmp';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import PrivateRoute from './privateRoute';
import RegisterPage from './pages/register';
import ActivateAccountPage from './pages/activateAccount';

import 'react-toastify/dist/ReactToastify.css';
import ReportPage from './pages/report';


const theme = createTheme({
  palette: {
    primary: {
      main: '#484e7a', // Replace this with your desired color (hex, rgb, or color name)
    },
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent baseline styles */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate" element={<ActivateAccountPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<DashboardPage />} requiredRoles={['HR', 'ADMIN']} />}
          />
          <Route
            path="/dashboardEmp"
            element={<PrivateRoute element={<DashboardEmpPage />} requiredRoles={['EMPLOYEE']} />}
          />
          <Route
            path="/employee"
            element={<PrivateRoute element={<EmployeePage />} requiredRoles={['HR', 'ADMIN']} />}
          />
          <Route
            path="/holiday"
            element={<PrivateRoute element={<HolidayPage />} requiredRoles={['HR', 'ADMIN']} />}
          />
          <Route
            path="/holidayEmp"
            element={<PrivateRoute element={<HolidayEmpPage />} requiredRoles={['EMPLOYEE']} />}
          />
          <Route
            path="/timeSheetEmp"
            element={<PrivateRoute element={<TimeSheetEmpPage />} requiredRoles={['EMPLOYEE']} />}
          />

          <Route
            path="/timeSheet"
            element={<PrivateRoute element={<TimeSheetPage />} requiredRoles={['HR', 'ADMIN']} />}
          />

          <Route
            path="/report"
            element={<PrivateRoute element={<ReportPage />} requiredRoles={['HR', 'ADMIN']} />}
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
