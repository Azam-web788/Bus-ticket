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
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
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
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 0.5 }} sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSwap}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 2,
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <SwapHoriz color="primary" />
              </Button>
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
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="error" fontSize="small" />
                        </InputAdornment>
                      ),
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
              />
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  height: 40,
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
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
