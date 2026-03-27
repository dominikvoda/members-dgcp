import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { api } from '../api/client';
import { useTranslation } from 'react-i18next';
import TagBadge from '../components/TagBadge';
import { type Tournament, getInitials, formatDateRange } from '../components/UpcomingTournaments';

const ACCENT = '#e65100';

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const { t: tr } = useTranslation();

  useEffect(() => {
    api
      .getUpcomingTournaments()
      .then((res) => setTournaments(res.data.tournaments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {tr('tournaments.upcoming')}
        </Typography>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={72} sx={{ mb: 1.5 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {tr('tournaments.upcoming')}
      </Typography>

      {tournaments.length === 0 ? (
        <Typography color="text.secondary">{tr('tournaments.empty')}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tournaments.map((tournament) => {
            const isExpanded = expanded.has(tournament.id);
            return (
              <Card
                key={tournament.id}
                sx={{
                  border: '1px solid',
                  borderColor: isExpanded ? ACCENT : 'divider',
                  boxShadow: isExpanded ? `0 4px 20px ${alpha(ACCENT, 0.12)}` : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: ACCENT,
                    boxShadow: `0 4px 20px ${alpha(ACCENT, 0.12)}`,
                  },
                }}
              >
                <CardContent
                  sx={{ cursor: 'pointer', '&:last-child': { pb: 2 } }}
                  onClick={() => toggle(tournament.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <EmojiEventsOutlinedIcon sx={{ color: ACCENT, fontSize: 24, flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>
                          {tournament.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateRange(tournament.dateStart, tournament.dateEnd)}
                          </Typography>
                          {tournament.cadgTier && (
                            <Chip
                              label={tournament.cadgTier}
                              size="small"
                              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fff3e0', color: '#e65100' }}
                            />
                          )}
                          {tournament.pdgaTournamentId && (
                            <Chip
                              label="PDGA"
                              size="small"
                              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#e3f2fd', color: '#1565c0' }}
                            />
                          )}
                          {tournament.region && (
                            <Typography variant="body2" color="text.secondary">
                              {tournament.region}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                      <AvatarGroup
                        max={8}
                        sx={{
                          '& .MuiAvatar-root': {
                            width: 30,
                            height: 30,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            borderWidth: 1.5,
                          },
                        }}
                      >
                        {tournament.members.map((m, i) => (
                          <Tooltip key={i} title={`${m.name} (${m.division})`} arrow>
                            <Avatar src={m.avatarUrl || undefined} alt={m.name} sx={{ bgcolor: '#0d47a1' }}>
                              {getInitials(m.name)}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                          component="a"
                          href={`https://idiscgolf.cz/turnaje/${tournament.iDiscGolfTournamentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="caption"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          sx={{ color: '#2e7d32', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
                        >
                          iDiscGolf <OpenInNewIcon sx={{ fontSize: 12 }} />
                        </Typography>
                        {tournament.pdgaTournamentId && (
                          <Typography
                            component="a"
                            href={`https://www.pdga.com/live/event/${tournament.pdgaTournamentId}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            sx={{ color: '#1565c0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
                          >
                            PDGA <OpenInNewIcon sx={{ fontSize: 12 }} />
                          </Typography>
                        )}
                      </Box>
                      <IconButton size="small">
                        <ExpandMoreIcon
                          sx={{
                            transition: 'transform 0.2s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>

                <Collapse in={isExpanded}>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ pl: 0, py: 0.75, width: 48 }} />
                            <TableCell sx={{ py: 0.75, fontWeight: 600 }}>{tr('tournaments.name')}</TableCell>
                            <TableCell sx={{ py: 0.75, fontWeight: 600 }}>{tr('tournaments.division')}</TableCell>
                            <TableCell sx={{ py: 0.75, fontWeight: 600 }}>{tr('tournaments.rating')}</TableCell>
                            <TableCell align="center" sx={{ py: 0.75, fontWeight: 600 }}>{tr('tournaments.tag')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tournament.members.map((m, i) => (
                            <TableRow key={i} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                              <TableCell sx={{ pl: 0, py: 1, width: 48 }}>
                                <Avatar src={m.avatarUrl || undefined} alt={m.name} sx={{ width: 36, height: 36, bgcolor: '#0d47a1', fontSize: '0.8rem' }}>
                                  {getInitials(m.name)}
                                </Avatar>
                              </TableCell>
                              <TableCell sx={{ py: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {m.name}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 1 }}>
                                <Chip label={m.division} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }} />
                              </TableCell>
                              <TableCell sx={{ py: 1 }}>
                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                  {m.iDiscGolfRating && (
                                    <Chip
                                      label={m.iDiscGolfRating}
                                      size="small"
                                      sx={{
                                        height: 22,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: '#e8f5e9',
                                        color: '#2e7d32',
                                      }}
                                    />
                                  )}
                                  {m.pdgaRating && (
                                    <Chip
                                      label={m.pdgaRating}
                                      size="small"
                                      sx={{
                                        height: 22,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        bgcolor: '#e3f2fd',
                                        color: '#1565c0',
                                      }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="center" sx={{ py: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <TagBadge number={m.tagNumber} size="small" />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TournamentsPage;
