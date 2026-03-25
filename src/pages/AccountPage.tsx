import React from 'react';
import { Box, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('account.title')}</Typography>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('account.name')}</Typography>
              <Typography>{user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography>{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">iDiscGolf ID</Typography>
              <Typography>{user.iDiscGolfId}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('account.pdga')}</Typography>
              <Typography>{user.pdgaNumber || '-'}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              href={`${import.meta.env.VITE_OAUTH_AUTHORIZE_URL?.replace('/oauth/authorize', '')}/profile`}
              target="_blank"
            >
              {t('account.changePassword')}
            </Button>
            <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>
              {t('account.logout')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountPage;
