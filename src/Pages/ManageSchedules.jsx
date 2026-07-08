import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { scheduleAPI, busAPI, routeAPI } from '../services/api';

const ManageSchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    busId: '', routeId: '', date: null, departureTime: '', arrivalTime: '', price: 0, availableSeats: 40, status: 'active',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedRes, busRes, routeRes] = await Promise.all([
          scheduleAPI.getAll(),
          busAPI.getAll(),
          routeAPI.getAll(),
        ]);
        setSchedules(schedRes.data.schedules || []);
        setBuses(busRes.data.buses || []);
        setRoutes(routeRes.data.routes || []);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({ busId: '', routeId: '', date: null, departureTime: '', arrivalTime: '', price: 0, availableSeats: 40, status: 'active' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      busId: schedule.bus_id,
      routeId: schedule.route_id,
      date: dayjs(schedule.date),
      departureTime: schedule.departure_time?.slice(0, 5) || schedule.departureTime,
      arrivalTime: schedule.arrival_time?.slice(0, 5) || schedule.arrivalTime,
      price: parseFloat(schedule.price),
      availableSeats: schedule.available_seats || schedule.availableSeats,
      status: schedule.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { ...formData, date: formData.date ? formData.date.format('YYYY-MM-DD') : '' };
      if (editingSchedule) {
        await scheduleAPI.update(editingSchedule.id, data);
      } else {
        await scheduleAPI.create(data);
      }
      const { data: schedData } = await scheduleAPI.getAll();
      setSchedules(schedData.schedules || []);
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save schedule.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await scheduleAPI.delete(id);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete schedule.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mr: 1 }}><ArrowBack /></IconButton>
          <Schedule color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Manage Schedules</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}
            sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            Add Schedule
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Bus</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Departure</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Arrival</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Available</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{schedule.bus_name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{schedule.from_city} - {schedule.to_city}</Typography></TableCell>
                    <TableCell>{formatDate(schedule.date)}</TableCell>
                    <TableCell>{schedule.departure_time?.slice(0, 5)}</TableCell>
                    <TableCell>{schedule.arrival_time?.slice(0, 5)}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600} color="primary">Rs. {parseFloat(schedule.price).toFixed(0)}</Typography></TableCell>
                    <TableCell>
                      <Chip label={schedule.available_seats} size="small"
                        color={schedule.available_seats <= 5 ? 'error' : schedule.available_seats <= 15 ? 'warning' : 'success'}
                        sx={{ borderRadius: 1, fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={schedule.status} size="small" color={schedule.status === 'active' ? 'success' : 'default'} sx={{ borderRadius: 1, fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(schedule)} color="primary"><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(schedule.id)} color="error"><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField label="Bus" value={formData.busId} onChange={(e) => setFormData({ ...formData, busId: e.target.value })} select fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    {buses.filter((b) => b.status === 'active').map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name} ({b.type})</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={6}>
                  <TextField label="Route" value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} select fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    {routes.filter((r) => r.status === 'active').map((r) => (
                      <MenuItem key={r.id} value={r.id}>{r.from_city} - {r.to_city}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <DatePicker label="Date" value={formData.date} onChange={(v) => setFormData({ ...formData, date: v })}
                slotProps={{ textField: { size: 'small', fullWidth: true, required: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } } }} />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField label="Departure Time" type="time" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} fullWidth size="small" required InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={6}>
                  <TextField label="Arrival Time" type="time" value={formData.arrivalTime} onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} fullWidth size="small" required InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField label="Price ($)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={6}>
                  <TextField label="Available Seats" type="number" value={formData.availableSeats} onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) || 0 })} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
              <TextField label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} select fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
              {editingSchedule ? 'Save Changes' : 'Add Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ManageSchedules;
