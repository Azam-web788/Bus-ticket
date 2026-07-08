import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  DirectionsBus,
  AccessTime,
  CalendarToday,
  Download,
  Cancel,
} from '@mui/icons-material';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'info',
};

const BookingCard = ({ booking, onCancel }) => {
  const {
    _id,
    busName,
    busType,
    from,
    to,
    date,
    departureTime,
    arrivalTime,
    seats = [],
    totalFare,
    status = 'confirmed',
    bookingDate,
  } = booking;

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsBus color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {busName || 'Bus Name'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {busType || 'Standard'} &bull; Booking ID: {_id ? _id.slice(-8).toUpperCase() : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={status.toUpperCase()}
            color={statusColors[status] || 'default'}
            size="small"
            sx={{ fontWeight: 600, borderRadius: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {formatDate(date)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Travel Date
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" color="action" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {formatTime(departureTime)} - {formatTime(arrivalTime)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Journey Time
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {from} &rarr; {to}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {seats.map((seat) => (
                <Chip
                  key={seat}
                  label={`Seat ${seat}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1, fontSize: 11 }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              ${totalFare?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Fare
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Ticket
          </Button>
          {status !== 'cancelled' && status !== 'completed' && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Cancel />}
              onClick={() => onCancel?.(_id)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
