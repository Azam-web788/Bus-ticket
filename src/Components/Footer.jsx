import { Box, Container, Typography, Link, Divider, Grid, IconButton } from '@mui/material';
import { DirectionsBus, Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DirectionsBus sx={{ color: 'primary.light', fontSize: 32 }} />
              <Typography variant="h6" fontWeight={700} color="white">
                BusTicket
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              Your trusted platform for bus ticket booking. Travel comfortably and safely
              with our extensive network of bus operators across the country.
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.light' } }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.light' } }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.400', '&:hover': { color: 'primary.light' } }}>
                <Instagram fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" color="white" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Link href="/" color="inherit" underline="hover" variant="body2">
                Home
              </Link>
              <Link href="/my-bookings" color="inherit" underline="hover" variant="body2">
                My Bookings
              </Link>
              <Link href="/profile" color="inherit" underline="hover" variant="body2">
                Profile
              </Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" color="white" fontWeight={600} gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Help Center
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                FAQs
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Contact Us
              </Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" color="white" fontWeight={600} gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email: support@busticket.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Phone: +1 (555) 123-4567
            </Typography>
            <Typography variant="body2">
              123 Bus Street, Transit City, TC 10001
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'grey.800' }} />
        <Typography variant="body2" color="grey.500" align="center">
          &copy; {new Date().getFullYear()} BusTicket. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
