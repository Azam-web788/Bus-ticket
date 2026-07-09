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
  CalendarToday,
  ConfirmationNumber,
  Home,
  ArrowForward,
  Luggage,
  Download,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from '../Components/TicketPDF';
import SeatLayout from '../Components/SeatLayout';
import { bookingAPI, scheduleAPI } from '../services/api';

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
            <CircularProgress size={56} thickness={3} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <DirectionsBus color="primary" sx={{ fontSize: 22, animation: 'float 2s ease-in-out infinite' }} />
            </Box>
          </Box>
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            Loading seat layout...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (bookingConfirmed) {
    const totalAmount = selectedSeats.length * (bus?.price || price);
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Success Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2e7d32, #43a047)',
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                p: 1.5,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                mb: 2,
                backdropFilter: 'blur(8px)',
              }}
            >
              <CheckCircle sx={{ fontSize: 56 }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ position: 'relative', zIndex: 1 }}>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5, position: 'relative', zIndex: 1 }}>
              Your seats have been booked successfully
            </Typography>
          </Box>

          {/* Booking Details */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 2.5,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 0.5, bgcolor: 'primary.light', borderRadius: 1, display: 'flex' }}>
                      <DirectionsBus color="primary" sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Bus</Typography>
                      <Typography variant="body1" fontWeight={700}>{bus?.name || 'Express Line'}</Typography>
                    </Box>
                  </Box>
                  <Chip label={bus?.type || 'Standard'} size="small" color="primary" variant="outlined" sx={{ borderRadius: 1, fontWeight: 600 }} />
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 0.5, bgcolor: '#fff3e0', borderRadius: 1, display: 'flex' }}>
                    <LocationOn sx={{ fontSize: 20, color: '#f57c00' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Route</Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {bus?.from || from} &rarr; {bus?.to || to}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 0.5, bgcolor: '#e8f5e9', borderRadius: 1, display: 'flex' }}>
                      <CalendarToday sx={{ fontSize: 20, color: '#2e7d32' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Travel Date</Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {formatDate(bus?.date || date)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">Time</Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {formatTime(bus?.departureTime || departureTime)}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 0.5, bgcolor: '#e3f2fd', borderRadius: 1, display: 'flex' }}>
                      <ConfirmationNumber sx={{ fontSize: 20, color: '#1565c0' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Seats</Typography>
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.3 }}>
                        {selectedSeats.map((seat) => (
                          <Chip
                            key={seat}
                            label={seat}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ borderRadius: 1, fontWeight: 700, fontSize: 11 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      Rs. {totalAmount.toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <PDFDownloadLink
                document={
                  <TicketPDF
                    booking={{
                      _id: bookingDetails?._id || id,
                      busName: bus?.name,
                      busType: bus?.type,
                      from: bus?.from || from,
                      to: bus?.to || to,
                      date: bus?.date || date,
                      departureTime: bus?.departureTime || departureTime,
                      arrivalTime: bus?.arrivalTime || arrivalTime,
                      seats: selectedSeats,
                      totalFare: selectedSeats.length * (bus?.price || price),
                      status: 'confirmed',
                    }}
                    userName={JSON.parse(localStorage.getItem('user') || 'null')?.name}
                  />
                }
                fileName={`BusTicket-${(bookingDetails?._id || id).slice(-8).toUpperCase()}.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <Button
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Download />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    {loading ? 'Generating...' : 'Download Ticket'}
                  </Button>
                )}
              </PDFDownloadLink>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
                startIcon={<Home />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                }}
              >
                Go Home
              </Button>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', mt: 2 }}>
              <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Confirmation sent to your email
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          borderRadius: 2,
          fontWeight: 600,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'primary.light', color: 'primary.main' },
        }}
      >
        Back to bus details
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Journey Info Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: 'linear-gradient(180deg, #1a237e, #3949ab)',
              },
            }}
          >
            <Box sx={{ p: { xs: 2.5, md: 3 }, pl: { xs: 3, md: 3.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
                    <DirectionsBus color="primary" sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{bus?.name || 'Express Line'}</Typography>
                    <Chip
                      label={bus?.type || 'Standard'}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 1, fontWeight: 600, fontSize: 11, mt: 0.3 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Date</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {new Date(bus?.date || date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Time</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatTime(bus?.departureTime || departureTime)} - {formatTime(bus?.arrivalTime || arrivalTime)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: 0.5, bgcolor: 'primary.light', borderRadius: 1, display: 'flex' }}>
                  <LocationOn color="primary" sx={{ fontSize: 18 }} />
                </Box>
                <Typography variant="body2" fontWeight={700}>
                  {bus?.from || from} &rarr; {bus?.to || to}
                </Typography>
              </Box>
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
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 96,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #1a237e, #3949ab)',
              color: 'white',
            }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13, letterSpacing: 0.5 }}>
                BOOKING SUMMARY
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              {/* Journey Details */}
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsBus sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Bus</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>{bus?.name || 'Express Line'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Route</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>{bus?.from || from} &rarr; {bus?.to || to}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {new Date(bus?.date || date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">Time</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {formatTime(bus?.departureTime || departureTime)} - {formatTime(bus?.arrivalTime || arrivalTime)}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {selectedSeats.length > 0 ? (
                <>
                  {/* Selected Seats */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                      Selected Seats
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {selectedSeats.map((seat) => (
                        <Chip
                          key={seat}
                          label={`Seat ${seat}`}
                          size="small"
                          color="secondary"
                          variant="filled"
                          sx={{
                            borderRadius: 1,
                            fontWeight: 700,
                            fontSize: 11,
                            color: 'white',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Price Breakdown */}
                  <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, mb: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Price per seat</Typography>
                        <Typography variant="body2" fontWeight={600}>Rs. {(bus?.price || price).toFixed(0)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Number of seats</Typography>
                        <Typography variant="body2" fontWeight={600}>x{selectedSeats.length}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Total */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                    <Typography variant="h6" fontWeight={700}>Total</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      Rs. {(selectedSeats.length * (bus?.price || price)).toFixed(0)}
                    </Typography>
                  </Box>

                  {/* Confirm Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBooking}
                    endIcon={<ArrowForward />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      py: 1.5,
                      fontSize: 15,
                    }}
                  >
                    Confirm Booking
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', mt: 1.5 }}>
                    <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Secure payment guaranteed
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 2, display: 'inline-flex', mb: 1.5 }}>
                    <Luggage sx={{ fontSize: 32, color: 'grey.400' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Select your seats from the layout to see the price summary
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatSelection;
