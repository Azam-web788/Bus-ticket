import { Box, CircularProgress, Typography } from '@mui/material';
<<<<<<< HEAD
import { DirectionsBus } from '@mui/icons-material';
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

const Loader = ({ message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={2}
    >
<<<<<<< HEAD
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={56} thickness={3} sx={{ color: 'primary.main' }} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DirectionsBus color="primary" sx={{ fontSize: 22, animation: 'float 2s ease-in-out infinite' }} />
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" fontWeight={500}>
=======
      <CircularProgress size={48} thickness={4} />
      <Typography variant="body1" color="text.secondary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
