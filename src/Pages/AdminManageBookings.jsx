import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  ConfirmationNumber,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { bookingAPI } from '../services/api';

const AdminManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mr: 1 }}><ArrowBack /></IconButton>
        <ConfirmationNumber color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Manage Bookings</Typography>
        <Button
          variant="outlined" startIcon={<Refresh />} onClick={fetchBookings}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fare</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No bookings found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {booking.id?.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {booking.user_name || booking.user_id?.slice(0, 8) || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.from_city && booking.to_city
                        ? `${booking.from_city} → ${booking.to_city}`
                        : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${booking.seats?.length || 0} seat${(booking.seats?.length || 0) !== 1 ? 's' : ''}`}
                      size="small" variant="outlined" sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      ${parseFloat(booking.total_fare || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(booking.booking_date || booking.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      size="small"
                      color={getStatusColor(booking.status)}
                      sx={{ borderRadius: 1, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {booking.status !== 'cancelled' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontSize: 12 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminManageBookings;
