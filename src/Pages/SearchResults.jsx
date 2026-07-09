import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Slider,
  FormControl,
<<<<<<< HEAD
=======
  InputLabel,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  Select,
  MenuItem,
  Paper,
  Stack,
  Drawer,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
<<<<<<< HEAD
  Divider,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/material';
import {
  FilterList,
  Close,
  AccessTime,
  AttachMoney,
  Sort,
<<<<<<< HEAD
  DirectionsBus,
  Error,
  SearchOff,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/icons-material';
import BusCard from '../Components/BusCard';
import { searchAPI } from '../services/api';

<<<<<<< HEAD
const busTypes = ['All', 'AC Sleeper', 'AC Seater', 'Non-AC'];
const sortOptions = [
  { value: 'departure', label: 'Departure Time' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
=======
const busTypes = ['All', 'AC Sleeper', 'AC Seater', 'Non-AC'];  const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'departure', label: 'Departure Time' },
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  { value: 'seats', label: 'Available Seats' },
];

const formatPrice = (price) => `Rs. ${price?.toFixed(0) || '0'}`;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    busType: 'All',
<<<<<<< HEAD
    priceRange: [0, 10000],
=======
    priceRange: [0, 100],
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
    departureRange: [0, 24],
  });
  const [sortBy, setSortBy] = useState('departure');

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await searchAPI.searchBuses({ from, to, date });
        setBuses(data.buses || []);

<<<<<<< HEAD
=======
        // Set price range based on actual data
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        if (data.buses?.length > 0) {
          const prices = data.buses.map((b) => b.price);
          const maxPrice = Math.max(...prices);
          setFilters((prev) => ({ ...prev, priceRange: [0, Math.ceil(maxPrice / 100) * 100] }));
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch buses. Please try again.');
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    if (from && to && date) {
      fetchBuses();
    } else {
      setLoading(false);
    }
  }, [from, to, date]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const filteredBuses = buses
    .filter((bus) => {
      if (filters.busType !== 'All' && bus.type !== filters.busType) return false;
      if (bus.price < filters.priceRange[0] || bus.price > filters.priceRange[1]) return false;
<<<<<<< HEAD
      const depHour = parseInt(bus.departureTime?.split(':')[0] || '0');
=======
      const depHour = parseInt(bus.departureTime.split(':')[0]);
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      if (depHour < filters.departureRange[0] || depHour > filters.departureRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
<<<<<<< HEAD
        case 'departure': return (a.departureTime || '').localeCompare(b.departureTime || '');
        case 'seats': return (b.availableSeats || 0) - (a.availableSeats || 0);
=======
        case 'departure': return a.departureTime.localeCompare(b.departureTime);
        case 'seats': return b.availableSeats - a.availableSeats;
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        default: return 0;
      }
    });

  const filtersContent = (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
<<<<<<< HEAD
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ bgcolor: 'grey.100' }}>
=======
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            <Close />
          </IconButton>
        )}
      </Box>

      <Stack spacing={3}>
        <Box>
<<<<<<< HEAD
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ fontSize: 13 }}>
=======
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
            Bus Type
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {busTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                variant={filters.busType === type ? 'filled' : 'outlined'}
                color={filters.busType === type ? 'primary' : 'default'}
                onClick={() => setFilters({ ...filters, busType: type })}
<<<<<<< HEAD
                sx={{
                  borderRadius: 1.5,
                  fontWeight: filters.busType === type ? 700 : 500,
                  '&:hover': { bgcolor: filters.busType === type ? 'primary.dark' : 'action.hover' },
                }}
=======
                sx={{ borderRadius: 1, '&:hover': { bgcolor: filters.busType === type ? 'primary.dark' : 'action.hover' } }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              />
            ))}
          </Stack>
        </Box>

<<<<<<< HEAD
        <Divider />

        <Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ fontSize: 13 }}>
            <AttachMoney sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Price Range
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
=======
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            <AttachMoney sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Price Range: Rs. {formatPrice(filters.priceRange[0])} - Rs. {formatPrice(filters.priceRange[1])}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={(_, newValue) => setFilters({ ...filters, priceRange: newValue })}
            min={0}
<<<<<<< HEAD
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `Rs. ${v}`}
            sx={{ color: 'primary.main' }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ fontSize: 13 }}>
            <AccessTime sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Departure Time
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {filters.departureRange[0]}:00 - {filters.departureRange[1]}:00
          </Typography>
=======
            max={100}
            step={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `Rs. ${v}`}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            <AccessTime sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Departure Time
          </Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          <Slider
            value={filters.departureRange}
            onChange={(_, newValue) => setFilters({ ...filters, departureRange: newValue })}
            min={0}
            max={24}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}:00`}
          />
        </Box>

        {isMobile && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => setDrawerOpen(false)}
<<<<<<< HEAD
            sx={{ borderRadius: 2, fontWeight: 700 }}
=======
            sx={{ borderRadius: 2, textTransform: 'none' }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          >
            Apply Filters
          </Button>
        )}
      </Stack>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
<<<<<<< HEAD
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1.5, display: 'flex' }}>
            <DirectionsBus color="primary" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {from} to {to}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(date)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.main',
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Error color="error" />
          <Typography color="error" variant="body2" fontWeight={500}>
            {error}
          </Typography>
=======
        <Typography variant="h5" fontWeight={700}>
          {from} to {to}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(date)} &bull; {loading ? 'Searching...' : `${filteredBuses.length} buses found`}
        </Typography>
      </Box>

      {error && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'error.main', bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid size={{ md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper
            elevation={0}
<<<<<<< HEAD
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 96,
            }}
=======
            sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 88 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          >
            {filtersContent}
          </Paper>
        </Grid>

        {/* Mobile Filters */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
<<<<<<< HEAD
            slotProps={{ paper: { sx: { width: 300, borderRadius: '0 20px 20px 0' } } }}
=======
            slotProps={{ paper: { sx: { width: 300, borderRadius: '0 16px 16px 0' } } }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          >
            {filtersContent}
          </Drawer>
        )}

        {/* Results */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Sort & Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
<<<<<<< HEAD
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <Button
                  startIcon={<FilterList />}
                  variant="outlined"
                  size="small"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Filters
                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Sort sx={{ fontSize: 18, color: 'text.secondary' }} />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      fontSize: 14,
                      '& fieldset': { borderColor: 'divider' },
                    }}
                  >
                    {sortOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {!loading && (
              <Chip
                label={`${filteredBuses.length} bus${filteredBuses.length !== 1 ? 'es' : ''} found`}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: 12 }}
              />
            )}
=======
              gap: 1,
            }}
          >
            {isMobile && (
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="small"
                onClick={() => setDrawerOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Filters
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sort fontSize="small" color="action" />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 2, '& fieldset': { borderColor: 'divider' } }}
                >
                  {sortOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} available
            </Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          </Paper>

          {/* Bus List */}
          {loading ? (
<<<<<<< HEAD
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress size={48} thickness={4} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2, fontWeight: 600 }}>
=======
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={48} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                Searching for buses...
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredBuses.map((bus) => (
                <BusCard key={bus._id} bus={bus} />
              ))}
            </Stack>
          )}

          {!loading && filteredBuses.length === 0 && (
<<<<<<< HEAD
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Box sx={{ mb: 2, color: 'grey.300' }}>
                <SearchOff sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" fontWeight={700} gutterBottom>
=======
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                No buses found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search for a different route
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResults;
