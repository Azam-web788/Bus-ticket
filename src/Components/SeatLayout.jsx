import { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { DirectionsBus, Info } from '@mui/icons-material';
import Seat from './Seat';

const generateSeats = (totalSeats = 40, bookedSeats = []) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  let seatNum = 1;

  for (let row = 0; row < rows; row++) {
    // left side: 2 seats
    for (let col = 0; col < 2; col++) {
      if (seatNum > totalSeats) break;
      seats.push({
        id: seatNum,
        number: seatNum,
        row,
        col,
        side: 'left',
        isBooked: bookedSeats.includes(seatNum),
        isWindow: col === 0,
      });
      seatNum++;
    }
    // right side: 2 seats
    for (let col = 2; col < 4; col++) {
      if (seatNum > totalSeats) break;
      seats.push({
        id: seatNum,
        number: seatNum,
        row,
        col,
        side: 'right',
        isBooked: bookedSeats.includes(seatNum),
        isWindow: col === 3,
      });
      seatNum++;
    }
  }
  return seats;
};

const SeatLayout = ({ totalSeats = 40, bookedSeats = [], onSeatsSelected, maxSelectable = 6 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seats = generateSeats(totalSeats, bookedSeats);

  const maxRows = Math.ceil(totalSeats / 4);

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      if (prev.length >= maxSelectable) {
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleContinue = () => {
    if (onSeatsSelected) {
      onSeatsSelected(selectedSeats);
    }
  };

  const getSeatByPosition = (row, col) => {
    return seats.find((s) => s.row === row && s.col === col);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <DirectionsBus color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Select Your Seats
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: 'primary.light', border: '2px solid', borderColor: 'primary.light' }} />
          <Typography variant="caption">Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: 'secondary.main' }} />
          <Typography variant="caption">Selected</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: 'action.disabledBackground', opacity: 0.6 }} />
          <Typography variant="caption">Booked</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mb: 3,
        }}
      >
        {/* Driver cabin */}
        <Box
          sx={{
            width: 120,
            height: 40,
            bgcolor: 'grey.100',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Driver
          </Typography>
        </Box>

        {/* Seat grid */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Array.from({ length: maxRows }, (_, row) => (
            <Box key={row} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {/* Left seats */}
              {[0, 1].map((col) => {
                const seat = getSeatByPosition(row, col);
                return seat ? (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    onSelect={handleSeatSelect}
                    selected={selectedSeats.includes(seat.id)}
                  />
                ) : (
                  <Box key={`empty-${col}`} sx={{ width: 40, height: 40 }} />
                );
              })}

              {/* Aisle */}
              <Box sx={{ width: 24 }} />

              {/* Right seats */}
              {[2, 3].map((col) => {
                const seat = getSeatByPosition(row, col);
                return seat ? (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    onSelect={handleSeatSelect}
                    selected={selectedSeats.includes(seat.id)}
                  />
                ) : (
                  <Box key={`empty-${col}`} sx={{ width: 40, height: 40 }} />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info fontSize="small" color="info" />
          <Typography variant="body2" color="text.secondary">
            {selectedSeats.length > 0
              ? `Selected ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}: ${selectedSeats.join(', ')}`
              : `Select up to ${maxSelectable} seats`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
            px: 4,
          }}
        >
          Continue with {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
        </Button>
      </Box>
    </Paper>
  );
};

export default SeatLayout;
