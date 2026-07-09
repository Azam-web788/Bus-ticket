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
  Autocomplete,
} from '@mui/material';
import {
  Route,
  Add,
  Edit,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { routeAPI } from '../services/api';

const cities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot',
  'Hyderabad', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Jhelum',
  'Gujrat', 'Sahiwal', 'Mardan', 'Abbottabad', 'Rahim Yar Khan',
  'Murree', 'Nankana Sahib', 'Okara', 'Vehari', 'Kasur',
];

const ManageRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    fromCity: '', toCity: '', distance: '', duration: '', basePrice: 0, status: 'active',
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await routeAPI.getAll();
        setRoutes(data.routes || []);
      } catch (err) {
        setError('Failed to load routes.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setFormData({ fromCity: '', toCity: '', distance: '', duration: '', basePrice: 0, status: 'active' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      fromCity: route.from_city || route.fromCity,
      toCity: route.to_city || route.toCity,
      distance: route.distance || '',
      duration: route.duration || '',
      basePrice: parseFloat(route.base_price || route.basePrice || 0),
      status: route.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRoute) {
        await routeAPI.update(editingRoute.id, formData);
      } else {
        await routeAPI.create(formData);
      }
      const { data } = await routeAPI.getAll();
      setRoutes(data.routes || []);
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save route.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await routeAPI.delete(id);
      setRoutes(routes.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete route.');
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
        <Route color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Manage Routes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}
          sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
          Add Route
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id} hover>
                  <TableCell><Typography variant="body2" fontWeight={600}>{route.from_city}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600}>{route.to_city}</Typography></TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.duration}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600} color="primary">${parseFloat(route.base_price).toFixed(2)}</Typography></TableCell>
                  <TableCell>
                    <Chip label={route.status} size="small" color={route.status === 'active' ? 'success' : 'default'} sx={{ borderRadius: 1, fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(route)} color="primary"><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(route.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Autocomplete value={formData.fromCity} onChange={(_, v) => setFormData({ ...formData, fromCity: v || '' })} options={cities} freeSolo
                  renderInput={(params) => (<TextField {...params} label="From" size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />)} />
              </Grid>
              <Grid size={6}>
                <Autocomplete value={formData.toCity} onChange={(_, v) => setFormData({ ...formData, toCity: v || '' })} options={cities} freeSolo
                  renderInput={(params) => (<TextField {...params} label="To" size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />)} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Distance" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} fullWidth size="small" placeholder="e.g. 225 miles" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={6}>
                <TextField label="Duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} fullWidth size="small" required placeholder="e.g. 5h 30m" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Base Price ($)" type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })} fullWidth size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={6}>
                <TextField label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} select fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            {editingRoute ? 'Save Changes' : 'Add Route'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageRoutes;
