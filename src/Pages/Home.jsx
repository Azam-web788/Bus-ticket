import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  DirectionsBus,
  Security,
  SupportAgent,
  CreditCard,
  TrendingFlat,
  Star,
} from '@mui/icons-material';
import SearchForm from '../Components/SearchForm';
import { searchAPI } from '../services/api';

const features = [
  {
    icon: <DirectionsBus sx={{ fontSize: 40 }} />,
    title: 'Wide Network',
    description: '500+ bus operators across 2000+ routes nationwide',
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Safe Travel',
    description: 'Verified operators with GPS-tracked buses',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for your queries',
  },
  {
    icon: <CreditCard sx={{ fontSize: 40 }} />,
    title: 'Easy Booking',
    description: 'Book in minutes with multiple payment options',
  },
];

const routeImages = [
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1544681281-6f2c1c6e5207?w=400&h=250&fit=crop',
];

const Home = () => {
  const navigate = useNavigate();
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await searchAPI.getPopularRoutes();
        setPopularRoutes(data.routes || []);
      } catch {
        // Fallback to hardcoded routes if API fails
        setPopularRoutes([
          { from_city: 'Lahore', to_city: 'Islamabad', base_price: 1200 },
          { from_city: 'Lahore', to_city: 'Karachi', base_price: 3500 },
          { from_city: 'Islamabad', to_city: 'Lahore', base_price: 1200 },
          { from_city: 'Karachi', to_city: 'Lahore', base_price: 3500 },
          { from_city: 'Lahore', to_city: 'Faisalabad', base_price: 600 },
          { from_city: 'Multan', to_city: 'Lahore', base_price: 1000 },
          { from_city: 'Faisalabad', to_city: 'Islamabad', base_price: 900 },
          { from_city: 'Peshawar', to_city: 'Islamabad', base_price: 700 },
        ]);
      } finally {
        setRoutesLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
          color: 'white',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, mb: 2, lineHeight: 1.2 }}
            >
              Book Bus Tickets
              <Box component="span" sx={{ color: 'primary.light', display: 'block' }}>
                With Ease &amp; Comfort
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 600, mx: 'auto' }}
            >
              Travel across the country with our extensive network of reliable bus operators.
              Best prices, guaranteed seats, and 24/7 support.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <SearchForm />
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" fontWeight={700} sx={{ textAlign: 'center' }} gutterBottom>
          Why Choose BusTicket?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, maxWidth: 600, mx: 'auto', textAlign: 'center' }}
        >
          We provide the best bus booking experience with guaranteed comfort and reliability
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Routes Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ textAlign: 'center' }} gutterBottom>
            Popular Routes
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 600, mx: 'auto', textAlign: 'center' }}
          >
            Explore our most booked routes with the best deals
          </Typography>
          <Grid container spacing={3}>
            {routesLoading ? (
              <Grid size={12} sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Grid>
            ) : (
              popularRoutes.slice(0, 8).map((route, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      },
                    }}
                    onClick={() => navigate(`/search-results?from=${route.from_city}&to=${route.to_city}&date=${new Date().toISOString().split('T')[0]}&passengers=1`)}
                  >
                    <Box
                      sx={{
                        height: 140,
                        background: `url(${routeImages[index % routeImages.length]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 12,
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'white',
                        }}
                      >
                        <Star sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={600}>
                          {(4.5 + index * 0.1).toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {route.from_city}
                        </Typography>
                        <TrendingFlat sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {route.to_city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Starting from
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          Rs. {route.base_price || route.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to Travel?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of happy travelers. Book your bus ticket now and enjoy a comfortable journey.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Search Buses
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href="#"
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
