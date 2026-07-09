import { useState, useEffect } from 'react';
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
  Logout,
  ConfirmationNumber,
  Person,
  AdminPanelSettings,
  ChevronRight,
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && user.role === 'admin';

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAnchorEl(null);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'My Bookings', path: '/my-bookings', auth: true },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin/dashboard', auth: true });
  }

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ width: 280, pt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, mb: 3 }}>
        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2, display: 'flex' }}>
          <DirectionsBus color="primary" sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" fontWeight={800} color="primary">
          BusTicket
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1, px: 1 }}>
        {navItems.map((item) => {
          if (item.auth && !isLoggedIn) return null;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: 15,
                  }}
                />
                <ChevronRight sx={{ fontSize: 18, opacity: 0.4 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 1 }} />
      <List sx={{ px: 1 }}>
        {isLoggedIn ? (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isActive('/profile')}
                sx={{ borderRadius: 2, py: 1.2 }}
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
                sx={{ borderRadius: 2, color: 'error.main', py: 1.2 }}
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
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/login"
                selected={isActive('/login')}
                sx={{ borderRadius: 2, py: 1.2 }}
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
                sx={{ borderRadius: 2, py: 1.2 }}
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
        bgcolor: scrolled ? 'rgba(255,255,255,0.9)' : 'background.paper',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'rgba(26,35,126,0.08)' : 'divider',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 64, md: 72 } }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

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
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: 'primary.main',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', lg: 'block' } }}>
                      {user.name?.split(' ')[0] || 'User'}
                    </Typography>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
                        elevation: 8,
                        sx: { mt: 1.5, minWidth: 220, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'visible' },
                      },
                    }}
                  >
                    <Box sx={{ px: 2.5, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {user.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email || ''}
                      </Typography>
                    </Box>
                    <Divider />
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
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      '&:hover': { bgcolor: 'rgba(26,35,126,0.04)' },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                    }}
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
        slotProps={{ paper: { sx: { borderRadius: '0 20px 20px 0' } } }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
