import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Email,
  Phone,
  CalendarToday,
  ConfirmationNumber,
  Logout,
} from '@mui/icons-material';
import { authAPI, bookingAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
        });

        // Fetch bookings stats
        try {
          const { data: bookingData } = await bookingAPI.getMyBookings();
          const bks = bookingData.bookings || [];
          setBookingsCount(bks.length);
          setTotalSpent(bks.reduce((sum, b) => sum + (b.totalFare || 0), 0));
          setUpcomingCount(bks.filter((b) => b.status === 'confirmed').length);
        } catch {
          // Bookings stats are secondary
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setError(err.response?.data?.error || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const { data } = await authAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Profile updated successfully!</Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {/* Profile Header */}
        <Box sx={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)', p: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.light', fontSize: 32, fontWeight: 700, border: '3px solid white' }}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h5" fontWeight={700}>{user.name || 'User'}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{user.role === 'admin' ? 'Administrator' : 'Passenger'}</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            {!isEditing ? (
              <Button variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, backdropFilter: 'blur(8px)' }}>
                Edit Profile
              </Button>
            ) : (
              <Button variant="contained" startIcon={<Save />} onClick={handleSave}
                sx={{ bgcolor: 'white', color: 'primary.main', textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: 'grey.100' } }}>
                Save
              </Button>
            )}
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 2, bgcolor: 'grey.50' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">{bookingsCount}</Typography>
                <Typography variant="caption" color="text.secondary">Total Bookings</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">${totalSpent.toFixed(0)}</Typography>
                <Typography variant="caption" color="text.secondary">Total Spent</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">{upcomingCount}</Typography>
                <Typography variant="caption" color="text.secondary">Upcoming Trips</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Profile Form */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Personal Information</Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Full Name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing}
                InputProps={{ startAdornment: <Person color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" value={formData.email} disabled
                InputProps={{ startAdornment: <Email color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing}
                InputProps={{ startAdornment: <Phone color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Member Since"
                value={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} disabled
                InputProps={{ startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
          </Grid>

          {user.role === 'admin' && (
            <Box sx={{ mt: 3 }}>
              <Chip icon={<ConfirmationNumber />} label="Admin Account" color="primary" variant="outlined" />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button variant="outlined" startIcon={<ConfirmationNumber />} onClick={() => navigate('/my-bookings')}
              sx={{ textTransform: 'none', borderRadius: 2 }}>View My Bookings</Button>
            <Button variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout}
              sx={{ textTransform: 'none', borderRadius: 2 }}>Logout</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
