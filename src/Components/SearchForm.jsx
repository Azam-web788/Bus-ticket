import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Autocomplete,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  SwapHoriz,
  CalendarToday,
  People,
  LocationOn,
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const popularCities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot',
  'Hyderabad', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Jhelum',
  'Gujrat', 'Sahiwal', 'Mardan', 'Abbottabad', 'Rahim Yar Khan',
  'Murree', 'Nankana Sahib', 'Okara', 'Vehari', 'Kasur',
];

const SearchForm = ({ initialFrom = '', initialTo = '', initialDate = null, initialPassengers = 1 }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate ? dayjs(initialDate) : dayjs().add(1, 'day'));
  const [passengers, setPassengers] = useState(initialPassengers);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    const searchDate = date || dayjs().add(1, 'day');
    const params = new URLSearchParams({
      from,
      to,
      date: searchDate.format('YYYY-MM-DD'),
      passengers: passengers.toString(),
    });
    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.97)',
        }}
      >
        <form onSubmit={handleSearch}>
          <Grid container spacing={1.5} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 3.5 }}>
              <Autocomplete
                inputValue={from}
                onInputChange={(_, newValue) => setFrom(newValue || '')}
                freeSolo
                options={popularCities.filter((c) => c !== to)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    required
                    size="small"
                    placeholder="Departure city"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'grey.50',
                        borderRadius: 3,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 0.5 }} sx={{ textAlign: 'center' }}>
              <IconButton
                onClick={handleSwap}
                size="small"
                sx={{
                  bgcolor: 'grey.100',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <SwapHoriz color="primary" sx={{ fontSize: 20 }} />
              </IconButton>
            </Grid>

            <Grid size={{ xs: 12, md: 3.5 }}>
              <Autocomplete
                inputValue={to}
                onInputChange={(_, newValue) => setTo(newValue || '')}
                freeSolo
                options={popularCities.filter((c) => c !== from)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    required
                    size="small"
                    placeholder="Arrival city"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="error" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'grey.50',
                        borderRadius: 3,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    required: true,
                    fullWidth: true,
                    placeholder: 'Travel date',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'grey.50',
                        borderRadius: 3,
                      },
                      '& .MuiInputBase-input': { py: 1.2 },
                    },
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    },
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 1 }}>
              <TextField
                type="number"
                label="Seats"
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Math.min(10, Number(e.target.value))))}
                size="small"
                placeholder="1"
                slotProps={{
                  htmlInput: { min: 1, max: 10 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <People fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.50',
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  height: 44,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 0.5,
                }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default SearchForm;
