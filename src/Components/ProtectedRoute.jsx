import { Link, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={2}
      >
        <Typography variant="h5" color="text.secondary">
          Please log in to access this page
        </Typography>
        <Button variant="contained" component={Link} to="/login">
          Go to Login
        </Button>
      </Box>
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={2}
      >
        <Typography variant="h5" color="text.secondary">
          Access denied. Admin privileges required.
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Go Home
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
