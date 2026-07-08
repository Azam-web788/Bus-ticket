import { Tooltip, Box } from '@mui/material';
import { AirlineSeatReclineNormal } from '@mui/icons-material';

const Seat = ({ seat, onSelect, selected }) => {
  const { id, number, isBooked } = seat;

  const handleClick = () => {
    if (!isBooked && onSelect) {
      onSelect(id);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isBooked) {
      e.preventDefault();
      handleClick();
    }
  };

  const getSeatColor = () => {
    if (isBooked) return 'action.disabledBackground';
    if (selected) return 'secondary.main';
    return 'primary.light';
  };

  const getSeatIconColor = () => {
    if (isBooked) return 'action.disabled';
    if (selected) return 'secondary.contrastText';
    return 'primary.main';
  };

  const getCursor = () => {
    if (isBooked) return 'not-allowed';
    return 'pointer';
  };

  const getTooltip = () => {
    if (isBooked) return `Seat ${number} - Booked`;
    if (selected) return `Seat ${number} - Selected`;
    return `Seat ${number} - Available`;
  };

  return (
    <Tooltip title={getTooltip()} arrow placement="top">
      <Box
        role="button"
        tabIndex={isBooked ? -1 : 0}
        aria-label={getTooltip()}
        aria-pressed={selected}
        aria-disabled={isBooked}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 1.5,
          bgcolor: getSeatColor(),
          cursor: getCursor(),
          opacity: isBooked ? 0.6 : 1,
          transition: 'all 0.15s ease',
          border: '2px solid',
          borderColor: selected ? 'secondary.main' : isBooked ? 'transparent' : 'primary.light',
          '&:hover': {
            transform: !isBooked ? 'scale(1.1)' : 'none',
            boxShadow: !isBooked ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        <AirlineSeatReclineNormal
          sx={{ fontSize: 18, color: getSeatIconColor() }}
        />
      </Box>
    </Tooltip>
  );
};

export default Seat;
