import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ConfirmationNumber,
  EventBusy,
  History,
  DirectionsBus,
  Search,
<<<<<<< HEAD
  TrendingFlat,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/icons-material';
import BookingCard from '../Components/BookingCard';
import { bookingAPI } from '../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await bookingAPI.getMyBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id);
<<<<<<< HEAD
=======
      // Update local state
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (tab === 0) return true;
    if (tab === 1) return b.status === 'confirmed';
    if (tab === 2) return b.status === 'completed';
    if (tab === 3) return b.status === 'cancelled';
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
<<<<<<< HEAD
        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
          <ConfirmationNumber color="primary" sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h4" fontWeight={800}>My Bookings</Typography>
=======
        <ConfirmationNumber color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700}>My Bookings</Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
      )}

<<<<<<< HEAD
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: 14, py: 1.5 },
            '& .Mui-selected': { fontWeight: 700 },
          }}
        >
          <Tab label="All" />
          <Tab label="Upcoming" icon={<DirectionsBus sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Completed" icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Cancelled" icon={<EventBusy sx={{ fontSize: 18 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} thickness={4} />
=======
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All" />
        <Tab label="Upcoming" icon={<DirectionsBus sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Completed" icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Cancelled" icon={<EventBusy sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} />
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        </Box>
      ) : filteredBookings.length > 0 ? (
        <Stack spacing={2}>
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))}
        </Stack>
      ) : (
<<<<<<< HEAD
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary" gutterBottom>
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            {tab === 0
              ? "You haven't made any bookings yet. Start planning your trip!"
              : `No ${tab === 1 ? 'upcoming' : tab === 2 ? 'completed' : 'cancelled'} bookings`}
          </Typography>
          {tab === 0 && (
            <Button
              variant="contained"
              endIcon={<TrendingFlat />}
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
            >
              Search Buses
            </Button>
          )}
=======
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No bookings found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tab === 0
              ? "You haven't made any bookings yet"
              : `No ${tab === 1 ? 'upcoming' : tab === 2 ? 'completed' : 'cancelled'} bookings`}
          </Typography>
          <Button variant="contained" startIcon={<Search />} onClick={() => navigate('/')} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Search Buses
          </Button>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        </Box>
      )}
    </Container>
  );
};

export default MyBookings;
