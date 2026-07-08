import { useState } from 'react';
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
  Dashboard,
  AccountCircle,
  Logout,
  ConfirmationNumber,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAnchorEl(null);
    navigate('/');
  };

  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'My Bookings', path: '/my-bookings', auth: true },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin/dashboard', auth: true });
  }

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, mb: 2 }}>
        <DirectionsBus color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h6" fontWeight={700} color="primary">
          BusTicket
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => {
          if (item.auth && !isLoggedIn) return null;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 1 }} />
      <List>
        {isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isActive('/profile')}
                sx={{ mx: 1, borderRadius: 2 }}
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
                sx={{ mx: 1, borderRadius: 2, color: 'error.main' }}
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
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                selected={isActive('/login')}
                sx={{ mx: 1, borderRadius: 2 }}
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
                sx={{ mx: 1, borderRadius: 2 }}
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
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

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
                      fontWeight: isActive(item.path) ? 600 : 400,
                      bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? 'primary.light' : 'action.hover',
                      },
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
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
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    size="small"
                    sx={{
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: 'primary.main',
                        fontSize: 14,
                      }}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
                        elevation: 2,
                        sx: { mt: 1, minWidth: 200, borderRadius: 2 },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email || ''}
                      </Typography>
                    </Box>
                    <Divider />
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
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
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
        slotProps={{ paper: { sx: { borderRadius: '0 16px 16px 0' } } }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
