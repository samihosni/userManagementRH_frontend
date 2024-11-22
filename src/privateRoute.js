
import { Navigate } from 'react-router-dom';

// This is a simple function to check the user's role.
// You can replace this with a more sophisticated check, such as using Redux, Context API, or fetching from a server.
const checkUserRole = () => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id");// Assuming user is stored in localStorage
  return storedRole ? storedRole : null; // Return the user's role (e.g., 'employee', 'hr', 'admin')
};

const PrivateRoute = ({ element, requiredRoles }) => {
  const userRole = checkUserRole();

  if (!userRole) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/" state={{ message: 'You need to log in to access this page.' }} />;
  }

  if (!requiredRoles.includes(userRole)) {
    // Redirect to home if the user doesn't have the correct role
    return <Navigate to="/" state={{ message: 'You do not have permission to access this page.' }} />;
  }

  // If user has the required role, render the component
  return element;
};

export default PrivateRoute;