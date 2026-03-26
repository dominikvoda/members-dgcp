import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  IconButton,
  Divider,
  alpha,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';
import TagBadge from '../components/TagBadge';

const TAGOVACKA_PRIMARY = '#001645';
const TAGOVACKA_ACCENT = '#db2228';
const JAMKOVKA_COLOR = '#2e7d32';
const HDGL_COLOR = '#5c6bc0';

const competitions = [
  {
    titleKey: 'competitions.tagovacka',
    descKey: 'competitions.tagovackaDesc',
    url: 'https://tagovacka.cz/club/dgcp',
    color: TAGOVACKA_PRIMARY,
    accent: TAGOVACKA_ACCENT,
    icon: <LocalOfferOutlinedIcon />,
  },
  {
    titleKey: 'competitions.jamkovka',
    descKey: 'competitions.jamkovkaDesc',
    url: 'https://jamkovka.dgcp.cz/',
    color: JAMKOVKA_COLOR,
    accent: JAMKOVKA_COLOR,
    icon: <AdjustOutlinedIcon />,
  },
  {
    titleKey: 'competitions.hdgl',
    descKey: 'competitions.hdglDesc',
    url: 'https://hdgl.lazerfunpraha.cz/',
    color: HDGL_COLOR,
    accent: HDGL_COLOR,
    icon: <LeaderboardOutlinedIcon />,
  },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) return null;

  const m = user.membership;
  const badgeColor = m?.club.tagBadgeColor || '#1565c0';
  const highlightColor = m?.club.tagBadgeHighlightColor || '#0d47a1';

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Competition tiles */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="overline" sx={{ mb: 1.5, display: 'block', letterSpacing: 1.5, color: 'text.secondary' }}>
            {t('home.competitions')}
          </Typography>
          <Grid container spacing={2}>
            {competitions.map((c) => (
              <Grid size={{ xs: 12, sm: 4 }} key={c.titleKey}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: c.accent,
                      boxShadow: `0 4px 20px ${alpha(c.accent, 0.15)}`,
                    },
                  }}
                >
                  <CardActionArea
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ height: '100%', p: 2.5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{ color: c.accent, display: 'flex' }}>
                        {c.icon}
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.color, mb: 0.5 }}>
                      {t(c.titleKey)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {t(c.descKey)}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Members link card */}
          <Card
            sx={{
              mt: 2.5,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
              },
            }}
            onClick={() => navigate('/members')}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, '&:last-child': { pb: 2 } }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t('nav.members')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.membersDesc')}
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ color: 'text.disabled' }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="overline" sx={{ mb: 1.5, display: 'block', letterSpacing: 1.5, color: 'text.secondary' }}>
            {t('home.profile')}
          </Typography>
          <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TagBadge
                  number={m?.tagNumber ?? null}
                  size="large"
                  badgeColor={badgeColor}
                  highlightColor={highlightColor}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {m && (
                    <Typography variant="body2" color="text.secondary">
                      {m.club.name}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">dGolf</Typography>
                  <IconButton
                    size="small"
                    component="a"
                    href={`https://www.dgolf.cz/cs/players/${user.iDiscGolfId}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Box>
                {user.pdgaNumber && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      PDGA #{user.pdgaNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      component="a"
                      href={`https://www.pdga.com/player/${user.pdgaNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
