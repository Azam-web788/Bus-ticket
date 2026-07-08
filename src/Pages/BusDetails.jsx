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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stack,
  CircularProgress,
  TextField,
  Alert,
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
} from '@mui/icons-material';
import { busAPI, reviewAPI, scheduleAPI } from '../services/api';

const amenityIcons = {
  wifi: { icon: <Wifi />, label: 'WiFi' },
  ac: { icon: <AcUnit />, label: 'Air Conditioning' },
  charging: { icon: <Power />, label: 'Charging Ports' },
  snacks: { icon: <Restaurant />, label: 'Snacks' },
  tv: { icon: <Tv />, label: 'Entertainment' },
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
        // Try schedule first (schedule ID is passed from search results)
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
        // Fallback: try fetching as plain bus
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
      // Refresh reviews
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error || !bus) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none', borderRadius: 2 }}>
          Back to results
        </Button>
        <Alert severity="error">{error || 'Bus not found'}</Alert>
      </Container>
    );
  }

  const seatPercentage = bus.total_seats ? ((bus.total_seats - (bus.availableSeats || bus.total_seats)) / bus.total_seats) * 100 : 0;
  const availableSeats = bus.availableSeats || bus.total_seats;
  const isLowAvailability = availableSeats <= 5;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none', borderRadius: 2 }}
      >
        Back to results
      </Button>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Bus Info Card */}
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
          </Paper>

          {/* Cancellation Policy */}
          {bus.cancellationPolicy && (
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Shield color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>Cancellation Policy</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{bus.cancellationPolicy}</Typography>
            </Paper>
          )}

          {/* Reviews Section */}
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
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            )}

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
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
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
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusDetails;
