import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Rating,
<<<<<<< HEAD
=======
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  LinearProgress,
  Stack,
  CircularProgress,
  TextField,
  Alert,
<<<<<<< HEAD
  Avatar,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/material';
import {
  DirectionsBus,
  AccessTime,
  AirlineSeatReclineNormal,
  Wifi,
  AcUnit,
  Power,
  Restaurant,
  Tv,
  LocationOn,
  CalendarToday,
  ArrowBack,
  Shield,
  Send,
<<<<<<< HEAD
  Star,
  Verified,
  CheckCircle,
  ArrowForward,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/icons-material';
import { busAPI, reviewAPI, scheduleAPI } from '../services/api';

const amenityIcons = {
<<<<<<< HEAD
  wifi: { icon: <Wifi sx={{ fontSize: 16 }} />, label: 'WiFi', color: '#1565c0', bgColor: '#e3f2fd' },
  ac: { icon: <AcUnit sx={{ fontSize: 16 }} />, label: 'Air Conditioning', color: '#2e7d32', bgColor: '#e8f5e9' },
  charging: { icon: <Power sx={{ fontSize: 16 }} />, label: 'Charging Ports', color: '#e65100', bgColor: '#fff3e0' },
  snacks: { icon: <Restaurant sx={{ fontSize: 16 }} />, label: 'Snacks', color: '#6a1b9a', bgColor: '#f3e5f5' },
  tv: { icon: <Tv sx={{ fontSize: 16 }} />, label: 'Entertainment', color: '#c62828', bgColor: '#ffebee' },
=======
  wifi: { icon: <Wifi />, label: 'WiFi' },
  ac: { icon: <AcUnit />, label: 'Air Conditioning' },
  charging: { icon: <Power />, label: 'Charging Ports' },
  snacks: { icon: <Restaurant />, label: 'Snacks' },
  tv: { icon: <Tv />, label: 'Entertainment' },
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
};

const BusDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
=======
        // Try schedule first (schedule ID is passed from search results)
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        const [schedRes, reviewsRes] = await Promise.all([
          scheduleAPI.getById(id),
          reviewAPI.getBusReviews(id).catch(() => ({ data: { reviews: [] } })),
        ]);
        const sched = schedRes.data.schedule;

        const busData = {
          _id: sched.id,
          bus_id: sched.bus_id,
          name: sched.bus_name,
          type: sched.bus_type,
          total_seats: sched.total_seats,
          amenities: sched.amenities || [],
          operator: sched.operator,
          registration_number: sched.registration_number,
          description: sched.description,
          departureTime: sched.departure_time?.slice(0, 5),
          arrivalTime: sched.arrival_time?.slice(0, 5),
          price: parseFloat(sched.price),
          availableSeats: sched.available_seats,
          from: sched.from_city,
          to: sched.to_city,
          date: sched.date,
          route_duration: sched.route_duration,
          rating: sched.rating || 0,
          totalRatings: sched.totalRatings || 0,
        };
        setBus(busData);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
<<<<<<< HEAD
=======
        // Fallback: try fetching as plain bus
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        try {
          const [busRes, reviewsRes] = await Promise.all([
            busAPI.getById(id),
            reviewAPI.getBusReviews(id).catch(() => ({ data: { reviews: [] } })),
          ]);
          setBus(busRes.data.bus);
          setReviews(reviewsRes.data.reviews || []);
        } catch (err2) {
          setError('Failed to load bus details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const { data } = await reviewAPI.create({
        busId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess('Review submitted successfully!');
      setReviewComment('');
<<<<<<< HEAD
=======
      // Refresh reviews
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      const reviewsRes = await reviewAPI.getBusReviews(id);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

<<<<<<< HEAD
  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
            Loading bus details...
          </Typography>
        </Box>
=======
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      </Box>
    );
  }

  if (error || !bus) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
<<<<<<< HEAD
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}
        >
          Back to results
        </Button>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'error.main',
            bgcolor: 'error.light',
            textAlign: 'center',
          }}
        >
          <Typography color="error" variant="h6" fontWeight={600}>
            {error || 'Bus not found'}
          </Typography>
        </Paper>
=======
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none', borderRadius: 2 }}>
          Back to results
        </Button>
        <Alert severity="error">{error || 'Bus not found'}</Alert>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      </Container>
    );
  }

  const seatPercentage = bus.total_seats ? ((bus.total_seats - (bus.availableSeats || bus.total_seats)) / bus.total_seats) * 100 : 0;
  const availableSeats = bus.availableSeats || bus.total_seats;
  const isLowAvailability = availableSeats <= 5;
<<<<<<< HEAD
  const isMediumAvailability = availableSeats <= 15;
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
<<<<<<< HEAD
        sx={{
          mb: 3,
          borderRadius: 2,
          fontWeight: 600,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'primary.light', color: 'primary.main' },
        }}
=======
        sx={{ mb: 2, textTransform: 'none', borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      >
        Back to results
      </Button>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Bus Info Card */}
<<<<<<< HEAD
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
            <Box sx={{ p: { xs: 2.5, md: 3.5 }, pl: { xs: 3, md: 4 } }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
                      <DirectionsBus color="primary" sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={800}>{bus.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                        <Chip
                          label={bus.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 1, fontWeight: 600, fontSize: 11 }}
                        />
                        {bus.rating > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 16, color: '#f57c00' }} />
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#f57c00' }}>
                              {bus.rating}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({bus.totalRatings || 0} reviews)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" fontWeight={800} color="primary">
                    Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    per seat
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Route Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ p: 0.5, bgcolor: 'primary.light', borderRadius: 1, display: 'flex' }}>
                    <LocationOn color="primary" sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      {bus.from} → {bus.to}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ p: 0.5, bgcolor: 'grey.100', borderRadius: 1, display: 'flex' }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {formatDate(bus.date)}
                  </Typography>
                </Box>
              </Box>

              {/* Time & Journey */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                    {formatTime(bus.departureTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Departure
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, maxWidth: 350, textAlign: 'center', px: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.8,
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      mb: 1,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {bus.route_duration || bus.duration || '--'}
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'relative', height: 4, bgcolor: 'grey.200', borderRadius: 2, mx: 1 }}>
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: -5,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '3px solid',
                      borderColor: 'primary.light',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      right: -5,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      border: '3px solid',
                      borderColor: 'error.light',
                      transform: 'translateY(-50%)',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '30%',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'grey.300',
                      transform: 'translateY(-50%)',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '60%',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'grey.300',
                      transform: 'translateY(-50%)',
                    }} />
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                    {formatTime(bus.arrivalTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Arrival
                  </Typography>
                </Box>
              </Box>

              {/* Seats Availability */}
              <Box sx={{
                bgcolor: isLowAvailability ? 'error.light' : isMediumAvailability ? 'warning.light' : 'success.light',
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      p: 0.5,
                      borderRadius: 1,
                      bgcolor: isLowAvailability ? 'error.main' : isMediumAvailability ? 'warning.main' : 'success.main',
                      display: 'flex',
                    }}>
                      <AirlineSeatReclineNormal sx={{ fontSize: 18, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {availableSeats} seats available
                      </Typography>
                      <Typography variant="caption" color={isLowAvailability ? 'error.dark' : isMediumAvailability ? 'warning.dark' : 'success.dark'} fontWeight={600}>
                        {bus.total_seats} total seats
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                    color={isLowAvailability ? 'error.dark' : isMediumAvailability ? 'warning.dark' : 'success.dark'}
                  >
                    {Math.round(seatPercentage)}% full
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={seatPercentage}
                  color={isLowAvailability ? 'error' : isMediumAvailability ? 'warning' : 'success'}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.08)' }}
                />
              </Box>

              {/* Amenities */}
              {bus.amenities?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: 15 }}>
                    Amenities
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {bus.amenities.map((a) => {
                      const amenity = amenityIcons[a] || { icon: null, label: a, color: '#1a237e', bgColor: '#e8eaf6' };
                      return (
                        <Chip
                          key={a}
                          icon={amenity.icon}
                          label={amenity.label}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontWeight: 600,
                            fontSize: 12,
                            borderColor: amenity.color + '40',
                            color: amenity.color,
                            bgcolor: amenity.bgColor,
                            '& .MuiChip-icon': { color: amenity.color },
                            '&:hover': { bgcolor: amenity.bgColor, borderColor: amenity.color },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {bus.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                  {bus.description}
                </Typography>
              )}

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                p: 1.5,
                bgcolor: 'grey.50',
                borderRadius: 2,
              }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Operator:</strong> {bus.operator || '--'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Reg no:</strong> {bus.registration_number || '--'}
                </Typography>
              </Box>
            </Box>
=======
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DirectionsBus color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h5" fontWeight={700}>{bus.name}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={bus.type} size="small" color="primary" variant="outlined" sx={{ borderRadius: 1 }} />
                  {bus.rating > 0 && (
                    <>
                      <Rating value={bus.rating} precision={0.5} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">({bus.totalRatings || 0} reviews)</Typography>
                    </>
                  )}
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">per seat</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Time & Journey */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700}>{formatTime(bus.departureTime)}</Typography>
                <Typography variant="body2" color="text.secondary">Departure</Typography>
              </Box>
              <Box sx={{ flex: 1, maxWidth: 300, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>{bus.route_duration || bus.duration || '--'}</Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 3, bgcolor: 'divider', borderRadius: 2, mx: 2 }}>
                  <Box sx={{ position: 'absolute', left: -4, top: -4, width: 11, height: 11, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Box sx={{ position: 'absolute', right: -4, top: -4, width: 11, height: 11, borderRadius: '50%', bgcolor: 'error.main' }} />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700}>{formatTime(bus.arrivalTime)}</Typography>
                <Typography variant="body2" color="text.secondary">Arrival</Typography>
              </Box>
            </Box>

            {/* Seats Availability */}
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AirlineSeatReclineNormal color={isLowAvailability ? 'error' : 'success'} />
                  <Typography variant="body2" fontWeight={600}>{availableSeats} seats available</Typography>
                </Box>
                <Typography variant="body2" color={isLowAvailability ? 'error.main' : 'success.main'} fontWeight={600}>
                  {Math.round(seatPercentage)}% full
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={seatPercentage} color={isLowAvailability ? 'error' : 'primary'} sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            {/* Amenities */}
            {bus.amenities?.length > 0 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Amenities</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  {bus.amenities.map((a) => (
                    <Chip key={a} icon={amenityIcons[a]?.icon} label={amenityIcons[a]?.label || a} variant="outlined" size="small" sx={{ borderRadius: 1, '& .MuiChip-icon': { fontSize: 16 } }} />
                  ))}
                </Stack>
              </>
            )}

            {bus.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{bus.description}</Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              <strong>Operator:</strong> {bus.operator} &bull; <strong>Reg no:</strong> {bus.registration_number}
            </Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          </Paper>

          {/* Cancellation Policy */}
          {bus.cancellationPolicy && (
<<<<<<< HEAD
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                mb: 3,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ p: 0.8, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
                    <Shield color="primary" />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>Cancellation Policy</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {bus.cancellationPolicy}
                </Typography>
              </Box>
=======
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Shield color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>Cancellation Policy</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{bus.cancellationPolicy}</Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            </Paper>
          )}

          {/* Reviews Section */}
<<<<<<< HEAD
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              p: { xs: 2.5, md: 3.5 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 0.8, bgcolor: '#fff3e0', borderRadius: 1.5, display: 'flex' }}>
                  <Star sx={{ color: '#f57c00' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Reviews</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              {bus.rating > 0 && (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#f57c00', lineHeight: 1 }}>
                    {bus.rating}
                  </Typography>
                  <Rating value={bus.rating} precision={0.5} size="small" readOnly />
                </Box>
              )}
            </Box>

            {/* Review Form */}
            {localStorage.getItem('token') && (
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ p: { xs: 2.5, md: 3 }, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Write a Review
                </Typography>
                <Rating
                  value={reviewRating}
                  onChange={(_, v) => setReviewRating(v || 5)}
                  sx={{ mb: 1.5, '& .MuiRating-icon': { fontSize: 28 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share your experience with this bus service..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  size="small"
                  sx={{
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                    },
                  }}
                />
                {reviewSuccess && (
                  <Alert severity="success" sx={{ mb: 1.5, borderRadius: 2 }}>{reviewSuccess}</Alert>
                )}
                {reviewError && (
                  <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>{reviewError}</Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  disabled={submittingReview}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
=======
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Reviews ({reviews.length})
            </Typography>

            {/* Review Form */}
            {localStorage.getItem('token') && (
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Write a Review</Typography>
                <Rating value={reviewRating} onChange={(_, v) => setReviewRating(v || 5)} sx={{ mb: 1 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  size="small"
                  sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                {reviewSuccess && <Alert severity="success" sx={{ mb: 1, borderRadius: 2 }}>{reviewSuccess}</Alert>}
                {reviewError && <Alert severity="error" sx={{ mb: 1, borderRadius: 2 }}>{reviewError}</Alert>}
                <Button type="submit" variant="contained" endIcon={<Send />} disabled={submittingReview} sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            )}

<<<<<<< HEAD
            {/* Reviews List */}
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              {reviews.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Star sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                  <Typography variant="h6" fontWeight={700} color="text.secondary" gutterBottom>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Be the first to share your experience!
                  </Typography>
                </Box>
              )}
              <Stack spacing={2}>
                {reviews.map((review, i) => (
                  <Paper
                    key={review.id || i}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {(review.user_name || 'A')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {review.user_name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                    {review.comment && (
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {review.comment}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
=======
            <Stack spacing={2}>
              {reviews.length === 0 && (
                <Typography variant="body2" color="text.secondary">No reviews yet. Be the first to review!</Typography>
              )}
              {reviews.map((review, i) => (
                <Box key={review.id || i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={600}>{review.user_name || 'Anonymous'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                  {review.comment && <Typography variant="body2" color="text.secondary">{review.comment}</Typography>}
                  {i < reviews.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                </Box>
              ))}
            </Stack>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
<<<<<<< HEAD
          <Box sx={{ position: 'sticky', top: 96 }}>
            {/* Price Summary */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                mb: 3,
                overflow: 'hidden',
              }}
            >
              <Box sx={{
                p: 2.5,
                background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                color: 'white',
              }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ opacity: 0.9, fontSize: 12, letterSpacing: 1 }}>
                  PRICE SUMMARY
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Ticket Price</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Bus Type</Typography>
                    <Chip label={bus.type} size="small" variant="outlined" sx={{ borderRadius: 1, fontWeight: 600, fontSize: 11 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Seats Available</Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={isLowAvailability ? 'error.main' : isMediumAvailability ? 'warning.main' : 'success.main'}
                    >
                      {availableSeats}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={800} color="primary">
                    Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/seat-selection/${bus._id || bus.id || id}`)}
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    py: 1.5,
                    fontSize: 15,
                  }}
                >
                  Select Seats
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', mt: 1.5 }}>
                  <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Free cancellation before 24 hours
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Safe & Secure */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 0.8, bgcolor: 'success.light', borderRadius: 1.5, display: 'flex' }}>
                    <Shield sx={{ color: 'success.main' }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>Safe & Secure</Typography>
                </Box>
                <Stack spacing={1.2}>
                  {[
                    { icon: <Verified sx={{ fontSize: 14 }} />, text: 'Verified bus operators' },
                    { icon: <Verified sx={{ fontSize: 14 }} />, text: 'GPS-tracked buses' },
                    { icon: <Verified sx={{ fontSize: 14 }} />, text: 'Secure payment gateways' },
                    { icon: <Verified sx={{ fontSize: 14 }} />, text: '24/7 customer support' },
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'success.main', display: 'flex' }}>{item.icon}</Box>
                      <Typography variant="body2" color="text.secondary">{item.text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
=======
          <Box sx={{ position: 'sticky', top: 88 }}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Price Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Ticket Price</Typography>
                <Typography variant="body2" fontWeight={600}>Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  Rs. {parseFloat(bus.price || bus.base_price || 0).toFixed(0)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate(`/seat-selection/${bus._id || bus.id || id}`)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                }}
              >
                Select Seats
              </Button>
            </Paper>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Shield color="success" />
                <Typography variant="subtitle2" fontWeight={600}>Safe & Secure</Typography>
              </Box>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">&bull; Verified bus operators</Typography>
                <Typography variant="caption" color="text.secondary">&bull; GPS-tracked buses</Typography>
                <Typography variant="caption" color="text.secondary">&bull; Secure payment</Typography>
                <Typography variant="caption" color="text.secondary">&bull; 24/7 customer support</Typography>
              </Stack>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusDetails;
