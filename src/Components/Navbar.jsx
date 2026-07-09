<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DirectionsBus,
<<<<<<< HEAD
=======
  Dashboard,
  AccountCircle,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  Logout,
  ConfirmationNumber,
  Person,
  AdminPanelSettings,
<<<<<<< HEAD
  ChevronRight,
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
<<<<<<< HEAD
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && user.role === 'admin';

<<<<<<< HEAD
  const navigate = useNavigate();

=======
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAnchorEl(null);
    navigate('/');
  };

<<<<<<< HEAD
=======
  const navigate = useNavigate();

>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'My Bookings', path: '/my-bookings', auth: true },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin/dashboard', auth: true });
  }

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
<<<<<<< HEAD
    <Box sx={{ width: 280, pt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, mb: 3 }}>
        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2, display: 'flex' }}>
          <DirectionsBus color="primary" sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" fontWeight={800} color="primary">
=======
    <Box sx={{ width: 260, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, mb: 2 }}>
        <DirectionsBus color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h6" fontWeight={700} color="primary">
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          BusTicket
        </Typography>
      </Box>
      <Divider />
<<<<<<< HEAD
      <List sx={{ pt: 1, px: 1 }}>
        {navItems.map((item) => {
          if (item.auth && !isLoggedIn) return null;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
=======
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => {
          if (item.auth && !isLoggedIn) return null;
          return (
            <ListItem key={item.label} disablePadding>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
<<<<<<< HEAD
                  borderRadius: 2,
                  py: 1.2,
=======
                  mx: 1,
                  borderRadius: 2,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                }}
                onClick={() => setMobileOpen(false)}
              >
<<<<<<< HEAD
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: 15,
                  }}
                />
                <ChevronRight sx={{ fontSize: 18, opacity: 0.4 }} />
=======
                <ListItemText primary={item.label} />
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 1 }} />
<<<<<<< HEAD
      <List sx={{ px: 1 }}>
        {isLoggedIn ? (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
=======
      <List>
        {isLoggedIn ? (
          <>
            <ListItem disablePadding>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isActive('/profile')}
<<<<<<< HEAD
                sx={{ borderRadius: 2, py: 1.2 }}
=======
                sx={{ mx: 1, borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                onClick={() => setMobileOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
<<<<<<< HEAD
                sx={{ borderRadius: 2, color: 'error.main', py: 1.2 }}
=======
                sx={{ mx: 1, borderRadius: 2, color: 'error.main' }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                onClick={() => { setMobileOpen(false); handleLogout(); }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
<<<<<<< HEAD
            <ListItem disablePadding sx={{ mb: 0.5 }}>
=======
            <ListItem disablePadding>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
              <ListItemButton
                component={RouterLink}
                to="/login"
                selected={isActive('/login')}
<<<<<<< HEAD
                sx={{ borderRadius: 2, py: 1.2 }}
=======
                sx={{ mx: 1, borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                selected={isActive('/register')}
<<<<<<< HEAD
                sx={{ borderRadius: 2, py: 1.2 }}
=======
                sx={{ mx: 1, borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
<<<<<<< HEAD
        bgcolor: scrolled ? 'rgba(255,255,255,0.9)' : 'background.paper',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'rgba(26,35,126,0.08)' : 'divider',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 64, md: 72 } }}>
=======
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

<<<<<<< HEAD
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              mr: 3,
            }}
          >
            <Box
              sx={{
                p: 0.8,
                bgcolor: 'primary.light',
                borderRadius: 1.5,
                display: 'flex',
                transition: 'all 0.3s',
                '&:hover': { transform: 'rotate(-5deg)' },
              }}
            >
              <DirectionsBus color="primary" sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '-0.5px',
              }}
            >
              BusTicket
            </Typography>
          </Box>
=======
          <DirectionsBus color="primary" sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              mr: 2,
            }}
          >
            BusTicket
          </Typography>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {navItems.map((item) => {
                if (item.auth && !isLoggedIn) return null;
                return (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.secondary',
<<<<<<< HEAD
                      fontWeight: isActive(item.path) ? 700 : 500,
                      bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? 'primary.light' : 'rgba(26,35,126,0.04)',
                        color: 'primary.main',
                      },
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      fontSize: 14,
                      transition: 'all 0.2s',
=======
                      fontWeight: isActive(item.path) ? 600 : 400,
                      bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? 'primary.light' : 'action.hover',
                      },
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
                <>
<<<<<<< HEAD
                  <Button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 10,
                      border: '2px solid',
                      borderColor: 'primary.light',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
                      textTransform: 'none',
                      color: 'text.primary',
=======
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    size="small"
                    sx={{
                      border: '2px solid',
                      borderColor: 'primary.main',
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                    }}
                  >
                    <Avatar
                      sx={{
<<<<<<< HEAD
                        width: 28,
                        height: 28,
                        bgcolor: 'primary.main',
                        fontSize: 12,
                        fontWeight: 700,
=======
                        width: 30,
                        height: 30,
                        bgcolor: 'primary.main',
                        fontSize: 14,
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                      }}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
<<<<<<< HEAD
                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', lg: 'block' } }}>
                      {user.name?.split(' ')[0] || 'User'}
                    </Typography>
                  </Button>
=======
                  </IconButton>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
<<<<<<< HEAD
                        elevation: 8,
                        sx: { mt: 1.5, minWidth: 220, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'visible' },
                      },
                    }}
                  >
                    <Box sx={{ px: 2.5, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
=======
                        elevation: 2,
                        sx: { mt: 1, minWidth: 200, borderRadius: 2 },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                        {user.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email || ''}
                      </Typography>
                    </Box>
                    <Divider />
<<<<<<< HEAD
                    <Box sx={{ py: 0.5 }}>
                      <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchorEl(null)} sx={{ mx: 0.5, borderRadius: 2 }}>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        Profile
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/my-bookings" onClick={() => setAnchorEl(null)} sx={{ mx: 0.5, borderRadius: 2 }}>
                        <ListItemIcon><ConfirmationNumber fontSize="small" /></ListItemIcon>
                        My Bookings
                      </MenuItem>
                      {isAdmin && (
                        <MenuItem component={RouterLink} to="/admin/dashboard" onClick={() => setAnchorEl(null)} sx={{ mx: 0.5, borderRadius: 2 }}>
                          <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                          Admin Dashboard
                        </MenuItem>
                      )}
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mx: 0.5, borderRadius: 2, my: 0.5 }}>
                      <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}>
=======
                    <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/my-bookings" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><ConfirmationNumber fontSize="small" /></ListItemIcon>
                      My Bookings
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem component={RouterLink} to="/admin/dashboard" onClick={() => setAnchorEl(null)}>
                        <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon sx={{ color: 'error.main' }}>
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
<<<<<<< HEAD
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      '&:hover': { bgcolor: 'rgba(26,35,126,0.04)' },
                    }}
=======
                    sx={{ textTransform: 'none', borderRadius: 2 }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
<<<<<<< HEAD
                    sx={{
                      borderRadius: 2,
                      px: 3,
                    }}
=======
                    sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
<<<<<<< HEAD
        slotProps={{ paper: { sx: { borderRadius: '0 20px 20px 0' } } }}
=======
        slotProps={{ paper: { sx: { borderRadius: '0 16px 16px 0' } } }}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
