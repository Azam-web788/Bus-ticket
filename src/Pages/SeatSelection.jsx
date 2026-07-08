import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsBus,
  ArrowBack,
  AccessTime,
  LocationOn,
  CheckCircle,
} from '@mui/icons-material';
import SeatLayout from '../Components/SeatLayout';
import { searchAPI, bookingAPI, scheduleAPI } from '../services/api';

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  // Get search params if available
  const from = searchParams.get('from') || 'Lahore';
  const to = searchParams.get('to') || 'Islamabad';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const departureTime = searchParams.get('departureTime') || '08:00';
  const arrivalTime = searchParams.get('arrivalTime') || '14:00';
  const price = parseFloat(searchParams.get('price') || '45');

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        // Fetch schedule details
        const [schedRes, seatsRes] = await Promise.all([
          scheduleAPI.getById(id),
          bookingAPI.getBookedSeats(id).catch(() => ({ data: { bookedSeats: [] } })),
        ]);
        const sched = schedRes.data.schedule;

        setBus({
          _id: sched.id,
          name: sched.bus_name,
          type: sched.bus_type,
          departureTime: sched.departure_time?.slice(0, 5),
          arrivalTime: sched.arrival_time?.slice(0, 5),
          price: parseFloat(sched.price),
          totalSeats: sched.total_seats,
          from: sched.from_city,
          to: sched.to_city,
          date: sched.date,
        });
        setBookedSeats(seatsRes.data.bookedSeats || []);
      } catch (err) {
        // Fallback with URL params
        setBus({
          _id: id,
          name: searchParams.get('name') || 'Express Line',
          type: searchParams.get('type') || 'AC Sleeper',
          departureTime,
          arrivalTime,
          price,
          totalSeats: 40,
          from,
          to,
          date,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [id]);

  const formatTime = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleBooking = async () => {
    try {
      const { data } = await bookingAPI.create({
        scheduleId: id,
        seats: selectedSeats,
      });
      setBookingDetails(data.booking);
      setBookingConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (bookingConfirmed) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>Booking Confirmed!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your seats have been booked successfully. You will receive a confirmation email shortly.
          </Typography>
          <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 3, textAlign: 'left' }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Bus</Typography>
                <Typography variant="body2" fontWeight={600}>{bus?.name || 'Express Line'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Route</Typography>
                <Typography variant="body2" fontWeight={600}>{bus?.from || from} &rarr; {bus?.to || to}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Seats</Typography>
                <Typography variant="body2" fontWeight={600}>{selectedSeats.join(', ')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Total</Typography>
                <Typography variant="body2" fontWeight={700} color="primary">
                  ${(selectedSeats.length * (bus?.price || price)).toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/my-bookings')} sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}>
              View My Bookings
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}>
              Go Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none', borderRadius: 2 }}>
        Back to bus details
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Journey Info */}
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsBus color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>{bus?.name || 'Express Line'}</Typography>
                  <Typography variant="body2" color="text.secondary">{bus?.type || 'AC Sleeper'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(bus?.date || date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Time</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatTime(bus?.departureTime || departureTime)} - {formatTime(bus?.arrivalTime || arrivalTime)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={500}>
                {bus?.from || from} &rarr; {bus?.to || to}
              </Typography>
            </Box>
          </Paper>

          {/* Seat Layout */}
          <SeatLayout
            totalSeats={bus?.totalSeats || 40}
            bookedSeats={bookedSeats}
            onSeatsSelected={handleSeatsSelected}
            maxSelectable={6}
          />
        </Grid>

        {/* Booking Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 88 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Booking Summary</Typography>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Bus</Typography>
                <Typography variant="body2" fontWeight={600}>{bus?.name || 'Express Line'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Route</Typography>
                <Typography variant="body2" fontWeight={600}>{bus?.from || from} &rarr; {bus?.to || to}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(bus?.date || date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Time</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatTime(bus?.departureTime || departureTime)} - {formatTime(bus?.arrivalTime || arrivalTime)}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {selectedSeats.length > 0 ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Selected Seats</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {selectedSeats.map((seat) => (
                      <Chip key={seat} label={seat} size="small" color="secondary" variant="outlined" sx={{ borderRadius: 1 }} />
                    ))}
                  </Stack>
                </Box>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Price per seat</Typography>
                    <Typography variant="body2">Rs. {(bus?.price || price).toFixed(0)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Seats</Typography>
                    <Typography variant="body2">x{selectedSeats.length}</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Rs. {(selectedSeats.length * (bus?.price || price)).toFixed(0)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBooking}
                  sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, py: 1.5, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                >
                  Confirm Booking
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary">Select your seats from the layout to see the price summary</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatSelection;
