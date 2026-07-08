import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  DirectionsBus,
  Route,
  Schedule,
  People,
  AttachMoney,
  ConfirmationNumber,
  Warning,
} from '@mui/icons-material';
import { busAPI, routeAPI, bookingAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [busRes, routeRes, bookingRes] = await Promise.all([
          busAPI.getAll(),
          routeAPI.getAll(),
          bookingAPI.getAll(),
        ]);

        const buses = busRes.data.buses || [];
        const routes = routeRes.data.routes || [];
        const bookings = bookingRes.data.bookings || [];

        const activeBuses = buses.filter((b) => b.status === 'active').length;
        const activeRoutes = routes.filter((r) => r.status === 'active').length;
        const totalRevenue = bookings
          .filter((b) => b.status !== 'cancelled')
          .reduce((sum, b) => sum + parseFloat(b.total_fare || 0), 0);

        setStats({
          totalBuses: buses.length,
          activeBuses,
          totalRoutes: routes.length,
          activeRoutes,
          totalBookings: bookings.length,
          totalRevenue,
        });

        setRecentBookings(bookings.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [location.pathname]);

  const statsCards = [
    { label: 'Total Buses', value: stats?.totalBuses?.toString() || '0', icon: <DirectionsBus />, color: '#1976d2', bgColor: '#e3f2fd' },
    { label: 'Active Routes', value: stats?.activeRoutes?.toString() || '0', icon: <Route />, color: '#388e3c', bgColor: '#e8f5e9' },
    { label: 'Total Bookings', value: stats?.totalBookings?.toString() || '0', icon: <ConfirmationNumber />, color: '#f57c00', bgColor: '#fff3e0' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <AttachMoney />, color: '#d32f2f', bgColor: '#ffebee' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Dashboard color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Avatar sx={{ bgcolor: stat.bgColor, width: 48, height: 48 }}>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Admin Navigation Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="subtitle2" fontWeight={600}>Admin Panel</Typography>
            </Box>
            <List sx={{ p: 0.5 }}>
              {[
                { icon: <Dashboard fontSize="small" />, label: 'Dashboard', path: '/admin/dashboard' },
                { icon: <DirectionsBus fontSize="small" />, label: 'Manage Buses', path: '/admin/manage-buses' },
                { icon: <Route fontSize="small" />, label: 'Manage Routes', path: '/admin/manage-routes' },
                { icon: <Schedule fontSize="small" />, label: 'Manage Schedules', path: '/admin/manage-schedules' },
                { icon: <ConfirmationNumber fontSize="small" />, label: 'Manage Bookings', path: '/admin/manage-bookings' },
                { icon: <People fontSize="small" />, label: 'Manage Users', path: '/admin/manage-users' },
              ].map((item) => (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main', '&:hover': { bgcolor: 'primary.light' } },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: location.pathname === item.path ? 600 : 400 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Quick Info */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'warning.main', p: 2, mt: 3, bgcolor: 'warning.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Warning color="warning" />
              <Typography variant="subtitle2" fontWeight={600}>Quick Info</Typography>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">&bull; {stats?.totalBuses || 0} buses registered</Typography>
              <Typography variant="body2" color="text.secondary">&bull; {stats?.activeRoutes || 0} active routes</Typography>
              <Typography variant="body2" color="text.secondary">&bull; {stats?.totalBookings || 0} total bookings</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Main Content - Recent Bookings */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: { xs: 2, md: 3 }, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>Recent Bookings</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate('/admin/manage-bookings')}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                View All
              </Button>
            </Box>
            <List sx={{ pt: 0 }}>
              {recentBookings.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No bookings yet</Typography>
                </Box>
              )}
              {recentBookings.map((booking, index) => (
                <Box key={booking.id}>
                  <ListItem alignItems="flex-start" sx={{ px: { xs: 2, md: 3 } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                        {(booking.user_name || 'U')[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={600}>{booking.user_name || 'User'}</Typography>
                          <Chip label={booking.status} size="small" color={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'error'} sx={{ borderRadius: 1, fontSize: 11, fontWeight: 600 }} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {booking.bus_name ? `${booking.bus_name} - ` : ''} {booking.seats?.length || 0} seat{(booking.seats?.length || 0) > 1 ? 's' : ''} &bull; ${parseFloat(booking.total_fare || 0).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.booking_date ? new Date(booking.booking_date).toLocaleString() : ''}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentBookings.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
