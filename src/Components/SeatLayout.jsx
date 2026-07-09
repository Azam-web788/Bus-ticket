import { useState } from 'react';
<<<<<<< HEAD
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { DirectionsBus, Info, CheckCircle } from '@mui/icons-material';
=======
import { Box, Typography, Paper, Button } from '@mui/material';
import { DirectionsBus, Info } from '@mui/icons-material';
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
import Seat from './Seat';

const generateSeats = (totalSeats = 40, bookedSeats = []) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  let seatNum = 1;

  for (let row = 0; row < rows; row++) {
<<<<<<< HEAD
=======
    // left side: 2 seats
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
=======
    // right side: 2 seats
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ p: 0.8, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
          <DirectionsBus color="primary" />
        </Box>
        <Typography variant="h6" fontWeight={700}>
=======
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <DirectionsBus color="primary" />
        <Typography variant="h6" fontWeight={600}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          Select Your Seats
        </Typography>
      </Box>

<<<<<<< HEAD
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap', p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: 0.5, bgcolor: '#e8eaf6', border: '2px solid', borderColor: '#c5cae9' }} />
          <Typography variant="caption" fontWeight={500}>Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: 0.5, bgcolor: '#ff6f00', boxShadow: '0 2px 4px rgba(255,111,0,0.3)' }} />
          <Typography variant="caption" fontWeight={500}>Selected</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: 0.5, bgcolor: '#e0e0e0', opacity: 0.6 }} />
          <Typography variant="caption" fontWeight={500}>Booked</Typography>
=======
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
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
            width: 130,
            height: 44,
=======
            width: 120,
            height: 40,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            bgcolor: 'grey.100',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
<<<<<<< HEAD
            border: '1px dashed',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            🚌 Driver
          </Typography>
        </Box>

        {/* Door indicator */}
        <Box
          sx={{
            width: 60,
            height: 20,
            bgcolor: 'grey.200',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 9, fontWeight: 600 }}>
            ENTRANCE
=======
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Driver
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          </Typography>
        </Box>

        {/* Seat grid */}
<<<<<<< HEAD
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {Array.from({ length: maxRows }, (_, row) => (
            <Box key={row} sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
              {/* Row label */}
              <Typography variant="caption" color="text.secondary" sx={{ width: 16, textAlign: 'center', fontWeight: 600, fontSize: 10 }}>
                {String.fromCharCode(65 + row)}
              </Typography>

=======
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Array.from({ length: maxRows }, (_, row) => (
            <Box key={row} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
              <Box sx={{ width: 28 }} />
=======
              <Box sx={{ width: 24 }} />
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

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
<<<<<<< HEAD
          p: 2,
          bgcolor: selectedSeats.length > 0 ? 'primary.light' : 'grey.50',
          borderRadius: 2,
          transition: 'all 0.3s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedSeats.length > 0 ? (
            <CheckCircle color="primary" />
          ) : (
            <Info fontSize="small" color="info" />
          )}
          <Typography variant="body2" color={selectedSeats.length > 0 ? 'primary.main' : 'text.secondary'} fontWeight={selectedSeats.length > 0 ? 600 : 400}>
=======
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info fontSize="small" color="info" />
          <Typography variant="body2" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
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
<<<<<<< HEAD
            borderRadius: 2,
            fontWeight: 700,
            px: 4,
            py: 1,
          }}
        >
          {selectedSeats.length > 0
            ? `Continue with ${selectedSeats.length} seat${selectedSeats.length !== 1 ? 's' : ''}`
            : 'Select Seats'}
=======
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
            px: 4,
          }}
        >
          Continue with {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        </Button>
      </Box>
    </Paper>
  );
};

export default SeatLayout;
