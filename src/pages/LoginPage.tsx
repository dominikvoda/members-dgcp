import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
  const { isAuthenticated, loading, login } = useAuth();
  const { t } = useTranslation();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/members" replace />;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            DGCP Members
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('login.subtitle')}
          </Typography>
          <Button variant="contained" size="large" fullWidth onClick={login}>
            {t('login.button')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
