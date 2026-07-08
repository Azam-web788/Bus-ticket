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
} from '@mui/icons-material';

const amenityIcons = {
  wifi: { icon: <Wifi fontSize="inherit" />, label: 'WiFi' },
  ac: { icon: <AcUnit fontSize="inherit" />, label: 'AC' },
  charging: { icon: <Power fontSize="inherit" />, label: 'Charging' },
  snacks: { icon: <Restaurant fontSize="inherit" />, label: 'Snacks' },
  tv: { icon: <Tv fontSize="inherit" />, label: 'TV' },
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

  const seatPercentage = (availableSeats / totalSeats) * 100;
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
                {name || 'Bus Name'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={type || 'Standard'}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1, fontSize: 12 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {amenities.slice(0, 4).map((a) => (
                  <Box
                    key={a}
                    title={amenityIcons[a]?.label || a}
                    sx={{ color: 'text.secondary', fontSize: 16, display: 'flex' }}
                  >
                    {amenityIcons[a]?.icon || null}
                  </Box>
                ))}
                {amenities.length > 4 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    +{amenities.length - 4}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              Rs. {price?.toFixed(0) || '0'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per seat
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {formatTime(departureTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Departure
            </Typography>
          </Box>

          <Box sx={{ flex: 1, mx: 3, position: 'relative' }}>
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
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
            <AirlineSeatReclineNormal fontSize="small" color={isLowAvailability ? 'error' : isMediumAvailability ? 'warning' : 'success'} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption" color="text.secondary">
                  Seats left
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={isLowAvailability ? 'error.main' : isMediumAvailability ? 'warning.main' : 'success.main'}
                >
                  {availableSeats}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={seatPercentage}
                color={isLowAvailability ? 'error' : isMediumAvailability ? 'warning' : 'success'}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/bus/${_id || '1'}`)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
              px: 3,
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
