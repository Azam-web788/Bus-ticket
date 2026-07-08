import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  People,
  AdminPanelSettings,
} from '@mui/icons-material';
import api from '../services/api';

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to load users. You may need admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async () => {
    try {
      const newRole = editingUser.role === 'admin' ? 'user' : 'admin';
      await api.put(`/auth/users/${editingUser.id}/role`, { role: newRole });
      fetchUsers();
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user role.');
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
        <People color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Manage Users</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2">{u.email}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{u.phone || '--'}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      icon={u.role === 'admin' ? <AdminPanelSettings fontSize="small" /> : null}
                      label={u.role}
                      size="small"
                      color={u.role === 'admin' ? 'primary' : 'default'}
                      variant={u.role === 'admin' ? 'filled' : 'outlined'}
                      sx={{ borderRadius: 1, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color={u.role === 'admin' ? 'error' : 'primary'}
                      onClick={() => { setEditingUser(u); setDialogOpen(true); }}
                      sx={{ textTransform: 'none', borderRadius: 1, fontSize: 12 }}
                    >
                      {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Change User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to {editingUser?.role === 'admin' ? 'remove admin privileges from' : 'make admin'} <strong>{editingUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current role: <Chip label={editingUser?.role} size="small" sx={{ borderRadius: 1 }} />
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={editingUser?.role === 'admin' ? 'error' : 'primary'}
            onClick={handleRoleChange}
            sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
          >
            {editingUser?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminManageUsers;
