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
  Shield,
  ArrowForward,
  Groups,
} from '@mui/icons-material';
import SearchForm from '../Components/SearchForm';
import { searchAPI } from '../services/api';

const features = [
  {
    icon: <DirectionsBus sx={{ fontSize: 36 }} />,
    title: 'Wide Network',
    description: '500+ bus operators across 2000+ routes nationwide',
    color: '#1a237e',
    bgColor: '#e8eaf6',
  },
  {
    icon: <Shield sx={{ fontSize: 36 }} />,
    title: 'Safe Travel',
    description: 'Verified operators with GPS-tracked, sanitized buses',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 36 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your queries',
    color: '#f57c00',
    bgColor: '#fff3e0',
  },
  {
    icon: <CreditCard sx={{ fontSize: 36 }} />,
    title: 'Easy Booking',
    description: 'Book in minutes with multiple secure payment options',
    color: '#d32f2f',
    bgColor: '#ffebee',
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
          background: 'linear-gradient(-45deg, #0d1442 0%, #1a237e 30%, #283593 60%, #3949ab 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          color: 'white',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20%',
            left: '-5%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
            animation: 'pulse 6s ease-in-out infinite 1s',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 20,
                px: 2.5,
                py: 0.8,
                mb: 3,
              }}
            >
              <Groups sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={600} sx={{ opacity: 0.9 }}>
                10,000+ Happy Travelers
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
                mb: 2,
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              Book Bus Tickets
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #ff6f00, #ffab00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                With Ease &amp; Comfort
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7,
              }}
            >
              Travel across the country with our extensive network of reliable bus operators.
              Best prices, guaranteed seats, and 24/7 support.
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 950,
              mx: 'auto',
              '& > *': {
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              },
            }}
          >
            <SearchForm />
          </Box>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {[
              { number: '500+', label: 'Bus Operators' },
              { number: '2,000+', label: 'Routes Covered' },
              { number: '50,000+', label: 'Happy Customers' },
              { number: '4.8/5', label: 'Average Rating' },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={800} color="primary">
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, fontSize: 13 }}
            >
              WHY CHOOSE US
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
              Why Choose BusTicket?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, maxWidth: 600, mx: 'auto', fontSize: 17 }}
            >
              We provide the best bus booking experience with guaranteed comfort and reliability
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      borderColor: feature.color,
                      transform: 'translateY(-6px)',
                      boxShadow: `0 12px 40px ${feature.color}15`,
                      '&::before': { opacity: 1 },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: feature.bgColor,
                      color: feature.color,
                      mx: 'auto',
                      mb: 2.5,
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.1) rotate(-5deg)' },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Routes Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, fontSize: 13 }}
            >
              EXPLORE ROUTES
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
              Popular Routes
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, maxWidth: 600, mx: 'auto', fontSize: 17 }}
            >
              Explore our most booked routes with the best deals and comfortable journeys
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {routesLoading ? (
              <Grid size={12} sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={40} thickness={4} />
              </Grid>
            ) : (
              popularRoutes.slice(0, 8).map((route, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 40px rgba(26,35,126,0.15)',
                        '& .route-image': {
                          transform: 'scale(1.08)',
                        },
                      },
                    }}
                    onClick={() => navigate(`/search-results?from=${route.from_city}&to=${route.to_city}&date=${new Date().toISOString().split('T')[0]}&passengers=1`)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <Box
                        className="route-image"
                        sx={{
                          height: 150,
                          background: `url(${routeImages[index % routeImages.length]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(26,35,126,0.9)',
                          color: 'white',
                          borderRadius: 1.5,
                          px: 1.2,
                          py: 0.4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Star sx={{ fontSize: 13 }} />
                        <Typography variant="caption" fontWeight={700}>
                          {(4.3 + Math.random() * 0.7).toFixed(1)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '60%',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {route.from_city}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: 'primary.light',
                          }}
                        >
                          <TrendingFlat sx={{ fontSize: 16, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {route.to_city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Starting from
                        </Typography>
                        <Typography variant="h6" fontWeight={800} color="primary">
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
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color: 'white', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Ready to Travel?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, fontSize: 17, lineHeight: 1.7 }}
          >
            Join thousands of happy travelers. Book your bus ticket now and enjoy a comfortable journey with the best prices guaranteed.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
              }}
              endIcon={<ArrowForward />}
            >
              Search Buses
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: 16,
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
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
