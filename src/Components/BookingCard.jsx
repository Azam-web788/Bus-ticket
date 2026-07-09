import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
<<<<<<< HEAD
  Stack,
=======
  IconButton,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/material';
import {
  DirectionsBus,
  AccessTime,
  CalendarToday,
  Download,
  Cancel,
<<<<<<< HEAD
  LocationOn,
  ConfirmationNumber,
} from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from './TicketPDF';

const statusColors = {
  confirmed: { color: 'success', bg: '#e8f5e9', text: '#2e7d32' },
  pending: { color: 'warning', bg: '#fff3e0', text: '#e65100' },
  cancelled: { color: 'error', bg: '#ffebee', text: '#c62828' },
  completed: { color: 'info', bg: '#e3f2fd', text: '#1565c0' },
};

const BookingCard = ({ booking, onCancel }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
=======
} from '@mui/icons-material';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'info',
};

const BookingCard = ({ booking, onCancel }) => {
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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

<<<<<<< HEAD
  const statusStyle = statusColors[status] || statusColors.confirmed;

=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
<<<<<<< HEAD
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 30px rgba(26,35,126,0.1)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.8, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
              <DirectionsBus color="primary" sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {busName || 'Bus Name'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                <ConfirmationNumber sx={{ fontSize: 12 }} />
                ID: {_id ? _id.slice(-8).toUpperCase() : 'N/A'} &bull; {busType || 'Standard'}
=======
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
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              </Typography>
            </Box>
          </Box>
          <Chip
            label={status.toUpperCase()}
<<<<<<< HEAD
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: 1.5,
              bgcolor: statusStyle.bg,
              color: statusStyle.text,
              fontSize: 11,
              letterSpacing: '0.5px',
            }}
=======
            color={statusColors[status] || 'default'}
            size="small"
            sx={{ fontWeight: 600, borderRadius: 1 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
<<<<<<< HEAD
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, bgcolor: 'grey.100', borderRadius: 1, display: 'flex' }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>
=======
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                {formatDate(date)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Travel Date
              </Typography>
            </Box>
          </Box>
<<<<<<< HEAD
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, bgcolor: 'grey.100', borderRadius: 1, display: 'flex' }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>
=======
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" color="action" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
            gap: 1.5,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700} color="primary.main">
                {from} &rarr; {to}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
=======
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {from} &rarr; {to}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              {seats.map((seat) => (
                <Chip
                  key={seat}
                  label={`Seat ${seat}`}
                  size="small"
                  variant="outlined"
<<<<<<< HEAD
                  color="primary"
                  sx={{ borderRadius: 1, fontSize: 10, fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" fontWeight={800} color="primary">
              ${totalFare?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
=======
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
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              Total Fare
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
<<<<<<< HEAD
          <PDFDownloadLink
            document={<TicketPDF booking={booking} userName={user?.name} />}
            fileName={`BusTicket-${_id?.slice(-8).toUpperCase() || 'ticket'}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download />}
                disabled={loading}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                {loading ? 'Generating...' : 'Ticket'}
              </Button>
            )}
          </PDFDownloadLink>
=======
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Ticket
          </Button>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          {status !== 'cancelled' && status !== 'completed' && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Cancel />}
              onClick={() => onCancel?.(_id)}
<<<<<<< HEAD
              sx={{ borderRadius: 2, fontWeight: 600 }}
=======
              sx={{ textTransform: 'none', borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
