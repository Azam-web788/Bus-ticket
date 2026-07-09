import { Box, Container, Typography, Link, Divider, Grid, IconButton, Stack } from '@mui/material';
import {
  DirectionsBus,
  Facebook,
  Twitter,
  Instagram,
  Email,
  Phone,
  LocationOn,
  ChevronRight,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0d1117',
        color: '#8b949e',
        mt: 'auto',
        pt: { xs: 5, md: 7 },
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #1a237e, #ff6f00, #1a237e)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'rgba(26,35,126,0.15)',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <DirectionsBus sx={{ color: '#5c6bc0', fontSize: 28 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="white">
                BusTicket
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 3, lineHeight: 1.8, color: '#6b7280', fontSize: 14 }}
            >
              Your trusted platform for bus ticket booking. Travel comfortably and safely
              with our extensive network of bus operators across the country.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                { icon: <Facebook sx={{ fontSize: 18 }} />, label: 'Facebook' },
                { icon: <Twitter sx={{ fontSize: 18 }} />, label: 'Twitter' },
                { icon: <Instagram sx={{ fontSize: 18 }} />, label: 'Instagram' },
              ].map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  aria-label={social.label}
                  sx={{
                    color: '#6b7280',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    width: 36,
                    height: 36,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(26,35,126,0.2)',
                      color: '#5c6bc0',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 700, mb: 2.5, letterSpacing: '0.5px', fontSize: 13 }}
            >
              QUICK LINKS
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'Home', path: '/' },
                { label: 'My Bookings', path: '/my-bookings' },
                { label: 'Profile', path: '/profile' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.path}
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#5c6bc0',
                      gap: 1,
                    },
                  }}
                >
                  <ChevronRight sx={{ fontSize: 14, opacity: 0.5 }} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 700, mb: 2.5, letterSpacing: '0.5px', fontSize: 13 }}
            >
              SUPPORT
            </Typography>
            <Stack spacing={1.2}>
              {['Help Center', 'FAQs', 'Contact Us'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#5c6bc0',
                      gap: 1,
                    },
                  }}
                >
                  <ChevronRight sx={{ fontSize: 14, opacity: 0.5 }} />
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 700, mb: 2.5, letterSpacing: '0.5px', fontSize: 13 }}
            >
              CONTACT INFO
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ fontSize: 18, color: '#5c6bc0' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                    support@busticket.com
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ fontSize: 18, color: '#5c6bc0' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOn sx={{ fontSize: 18, color: '#5c6bc0' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                    123 Bus Street, Transit City, TC 10001
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3.5, borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: 13 }}>
            &copy; {new Date().getFullYear()} BusTicket. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
              <Link
                key={text}
                href="#"
                sx={{ color: '#6b7280', textDecoration: 'none', fontSize: 13, '&:hover': { color: '#5c6bc0' } }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
