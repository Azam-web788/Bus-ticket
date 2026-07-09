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
  DirectionsBus,
  Add,
  Edit,
  Delete,
  ArrowBack,
} from '@mui/icons-material';

const amenityOptions = ['wifi', 'ac', 'charging', 'snacks', 'tv'];
import { useNavigate } from 'react-router-dom';
import { busAPI } from '../services/api';

const busTypes = ['AC Sleeper', 'AC Seater', 'Non-AC', 'AC Semi-Sleeper'];

const ManageBuses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: 'AC Sleeper', totalSeats: 40, operator: '', registrationNumber: '', status: 'active', amenities: [],
  });

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data } = await busAPI.getAll();
        setBuses(data.buses || []);
      } catch (err) {
        setError('Failed to load buses.');
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const handleOpenAdd = () => {
    setEditingBus(null);
    setFormData({ name: '', type: 'AC Sleeper', totalSeats: 40, operator: '', registrationNumber: '', status: 'active', amenities: [] });
    setDialogOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      name: bus.name,
      type: bus.type,
      totalSeats: bus.total_seats || bus.totalSeats,
      operator: bus.operator,
      registrationNumber: bus.registration_number || bus.registrationNumber,
      status: bus.status,
      amenities: bus.amenities || [],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingBus) {
        await busAPI.update(editingBus.id, { ...formData, amenities: formData.amenities });
      } else {
        await busAPI.create({ ...formData, amenities: formData.amenities });
      }
      // Refresh list
      const { data } = await busAPI.getAll();
      setBuses(data.buses || []);
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save bus.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    try {
      await busAPI.delete(id);
      setBuses(buses.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete bus.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mr: 1 }}><ArrowBack /></IconButton>
        <DirectionsBus color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Manage Buses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}
          sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
          Add Bus
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Operator</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id} hover>
                  <TableCell><Typography variant="body2" fontWeight={600}>{bus.name}</Typography></TableCell>
                  <TableCell><Chip label={bus.type} size="small" variant="outlined" sx={{ borderRadius: 1 }} /></TableCell>
                  <TableCell>{bus.total_seats || bus.totalSeats}</TableCell>
                  <TableCell>{bus.operator}</TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{bus.registration_number}</Typography></TableCell>
                  <TableCell>
                    <Chip label={bus.status} size="small" color={bus.status === 'active' ? 'success' : 'default'} sx={{ borderRadius: 1, fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(bus)} color="primary"><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(bus.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField label="Bus Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField label="Bus Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} select fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              {busTypes.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
            </TextField>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Total Seats" type="number" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={6}>
                <TextField label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} select fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField label="Operator" value={formData.operator} onChange={(e) => setFormData({ ...formData, operator: e.target.value })} fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField label="Registration Number" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>Amenities</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {amenityOptions.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                    color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                    onClick={() => {
                      const updated = formData.amenities.includes(amenity)
                        ? formData.amenities.filter((a) => a !== amenity)
                        : [...formData.amenities, amenity];
                      setFormData({ ...formData, amenities: updated });
                    }}
                    sx={{ borderRadius: 1, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            {editingBus ? 'Save Changes' : 'Add Bus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBuses;
