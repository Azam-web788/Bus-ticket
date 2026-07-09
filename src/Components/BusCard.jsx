import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  LinearProgress,
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
<<<<<<< HEAD
  ArrowForward,
} from '@mui/icons-material';

const amenityIcons = {
  wifi: { icon: <Wifi sx={{ fontSize: 15 }} />, label: 'WiFi' },
  ac: { icon: <AcUnit sx={{ fontSize: 15 }} />, label: 'AC' },
  charging: { icon: <Power sx={{ fontSize: 15 }} />, label: 'Charging' },
  snacks: { icon: <Restaurant sx={{ fontSize: 15 }} />, label: 'Snacks' },
  tv: { icon: <Tv sx={{ fontSize: 15 }} />, label: 'TV' },
=======
} from '@mui/icons-material';

const amenityIcons = {
  wifi: { icon: <Wifi fontSize="inherit" />, label: 'WiFi' },
  ac: { icon: <AcUnit fontSize="inherit" />, label: 'AC' },
  charging: { icon: <Power fontSize="inherit" />, label: 'Charging' },
  snacks: { icon: <Restaurant fontSize="inherit" />, label: 'Snacks' },
  tv: { icon: <Tv fontSize="inherit" />, label: 'TV' },
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
};

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  const {
    _id,
    name,
    type,
    departureTime,
    arrivalTime,
    duration,
    price,
    totalSeats,
    availableSeats,
    amenities = [],
  } = bus;

<<<<<<< HEAD
  const seatPercentage = totalSeats ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;
=======
  const seatPercentage = (availableSeats / totalSeats) * 100;
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  const isLowAvailability = availableSeats <= 5;
  const isMediumAvailability = availableSeats <= 15;

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
<<<<<<< HEAD
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 30px rgba(26,35,126,0.1)',
          transform: 'translateY(-3px)',
          '&::before': { opacity: 1 },
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, pl: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <Box sx={{ p: 0.5, bgcolor: 'primary.light', borderRadius: 1, display: 'flex' }}>
                <DirectionsBus color="primary" sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700}>
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
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <DirectionsBus color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="h6" fontWeight={600}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                {name || 'Bus Name'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={type || 'Standard'}
                size="small"
                variant="outlined"
<<<<<<< HEAD
                color="primary"
                sx={{ borderRadius: 1, fontSize: 11, fontWeight: 600 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
=======
                sx={{ borderRadius: 1, fontSize: 12 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                {amenities.slice(0, 4).map((a) => (
                  <Box
                    key={a}
                    title={amenityIcons[a]?.label || a}
<<<<<<< HEAD
                    sx={{
                      color: 'text.secondary',
                      display: 'flex',
                      p: 0.3,
                      borderRadius: 0.5,
                      bgcolor: 'grey.100',
                    }}
=======
                    sx={{ color: 'text.secondary', fontSize: 16, display: 'flex' }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  >
                    {amenityIcons[a]?.icon || null}
                  </Box>
                ))}
                {amenities.length > 4 && (
<<<<<<< HEAD
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>
=======
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                    +{amenities.length - 4}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
<<<<<<< HEAD
            <Typography variant="h5" fontWeight={800} color="primary">
              Rs. {price?.toFixed(0) || '0'}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
=======
            <Typography variant="h5" fontWeight={700} color="primary">
              Rs. {price?.toFixed(0) || '0'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              per seat
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

<<<<<<< HEAD
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800}>
              {formatTime(departureTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
=======
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {formatTime(departureTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              Departure
            </Typography>
          </Box>

          <Box sx={{ flex: 1, mx: 3, position: 'relative' }}>
<<<<<<< HEAD
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.8 }}>
              <AccessTime sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {duration || '--'}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 3, bgcolor: 'grey.200', borderRadius: 2 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  left: -1,
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.light',
                  zIndex: 1,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -1,
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  border: '2px solid',
                  borderColor: 'error.light',
                }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800}>
              {formatTime(arrivalTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
=======
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
              <AccessTime fontSize="small" color="action" sx={{ fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {duration || '--'}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 2,
                bgcolor: 'divider',
                position: 'relative',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  transform: 'translateY(-50%)',
                },
                '&::before': {
                  left: 0,
                  bgcolor: 'primary.main',
                },
                '&::after': {
                  right: 0,
                  bgcolor: 'error.main',
                },
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {formatTime(arrivalTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              Arrival
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
<<<<<<< HEAD
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 150 }}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 1,
                bgcolor: isLowAvailability ? 'error.light' : isMediumAvailability ? 'warning.light' : 'success.light',
                display: 'flex',
              }}
            >
              <AirlineSeatReclineNormal
                sx={{
                  fontSize: 18,
                  color: isLowAvailability ? 'error.main' : isMediumAvailability ? 'warning.main' : 'success.main',
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
=======
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
            <AirlineSeatReclineNormal fontSize="small" color={isLowAvailability ? 'error' : isMediumAvailability ? 'warning' : 'success'} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  Seats left
                </Typography>
                <Typography
                  variant="caption"
<<<<<<< HEAD
                  fontWeight={700}
=======
                  fontWeight={600}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  color={isLowAvailability ? 'error.main' : isMediumAvailability ? 'warning.main' : 'success.main'}
                >
                  {availableSeats}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={seatPercentage}
                color={isLowAvailability ? 'error' : isMediumAvailability ? 'warning' : 'success'}
<<<<<<< HEAD
                sx={{ height: 5, borderRadius: 3, bgcolor: 'grey.200' }}
=======
                sx={{ height: 4, borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/bus/${_id || '1'}`)}
<<<<<<< HEAD
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              py: 1,
              fontSize: 13,
=======
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
              px: 3,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BusCard;
