import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import SearchResults from './Pages/SearchResults';
import BusDetails from './Pages/BusDetails';
import SeatSelection from './Pages/SeatSelection';
import MyBookings from './Pages/MyBookings';
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/AdminDashboard';
import ManageBuses from './Pages/ManageBuses';
import ManageRoutes from './Pages/ManageRoutes';
import ManageSchedules from './Pages/ManageSchedules';
import AdminManageBookings from './Pages/AdminManageBookings';
import AdminManageUsers from './Pages/AdminManageUsers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#e8eaf6',
      dark: '#0d1442',
    },
    secondary: {
      main: '#ff6f00',
      light: '#fff8e1',
    },
    success: {
      main: '#2e7d32',
      light: '#e8f5e9',
    },
    warning: {
      main: '#ed6c02',
      light: '#fff3e0',
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/bus/:id" element={<BusDetails />} />
              <Route path="/seat-selection/:id" element={<SeatSelection />} />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-buses"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageBuses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-routes"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageRoutes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-schedules"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageSchedules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-bookings"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminManageBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-users"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminManageUsers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
