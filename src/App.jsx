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
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00',
      light: '#fff8e1',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#e8f5e9',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#fff3e0',
      dark: '#c43e00',
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee',
      dark: '#b71c1c',
    },
    background: {
      default: '#f8f9fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 600, letterSpacing: '0.01em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    caption: { fontWeight: 500, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(26,35,126,0.06), 0px 1px 2px rgba(26,35,126,0.04)',
    '0px 2px 6px rgba(26,35,126,0.08), 0px 1px 3px rgba(26,35,126,0.04)',
    '0px 4px 12px rgba(26,35,126,0.08), 0px 2px 4px rgba(26,35,126,0.04)',
    '0px 6px 20px rgba(26,35,126,0.08), 0px 3px 6px rgba(26,35,126,0.04)',
    '0px 8px 30px rgba(26,35,126,0.1), 0px 4px 8px rgba(26,35,126,0.04)',
    '0px 10px 40px rgba(26,35,126,0.1), 0px 6px 12px rgba(26,35,126,0.04)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
          borderRadius: 10,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(26,35,126,0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(26,35,126,0.3)',
          },
        },
        outlined: {
          '&:hover': {
            boxShadow: '0 2px 8px rgba(26,35,126,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a237e',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
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
