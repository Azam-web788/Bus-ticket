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
    if (isBooked) return '#e0e0e0';
    if (selected) return '#ff6f00';
    return '#e8eaf6';
  };

  const getSeatIconColor = () => {
    if (isBooked) return '#9e9e9e';
    if (selected) return '#ffffff';
    return '#1a237e';
  };

  const getBorderColor = () => {
    if (isBooked) return 'transparent';
    if (selected) return '#ff6f00';
    return '#c5cae9';
  };

  const getTooltip = () => {
    if (isBooked) return `Seat ${number} - Booked`;
    if (selected) return `Seat ${number} - Selected`;
    return `Seat ${number} - Available`;
  };

  return (
    <Tooltip title={getTooltip()} arrow placement="top" sx={{ '& .MuiTooltip-tooltip': { fontWeight: 500 } }}>
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
          cursor: isBooked ? 'not-allowed' : 'pointer',
          opacity: isBooked ? 0.5 : 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '2px solid',
          borderColor: getBorderColor(),
          transform: selected ? 'scale(1.05)' : 'none',
          boxShadow: selected ? '0 2px 12px rgba(255,111,0,0.3)' : 'none',
          '&:hover': {
            transform: !isBooked ? 'scale(1.12) translateY(-2px)' : 'none',
            boxShadow: !isBooked ? '0 4px 12px rgba(26,35,126,0.2)' : 'none',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
          '&:active': !isBooked ? { transform: 'scale(0.95)' } : {},
        }}
      >
        <AirlineSeatReclineNormal
          sx={{
            fontSize: 18,
            color: getSeatIconColor(),
            transition: 'color 0.2s',
          }}
        />
        <Box
          component="span"
          sx={{
            position: 'absolute',
            bottom: 1,
            fontSize: 7,
            fontWeight: 700,
            color: selected ? 'white' : isBooked ? '#9e9e9e' : '#1a237e',
            lineHeight: 1,
          }}
        >
          {number}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default Seat;
