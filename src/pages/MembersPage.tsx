import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';
import TagBadge from '../components/TagBadge';

interface Member {
  name: string;
  iDiscGolfId: number;
  pdgaNumber: number | null;
  tagNumber: number | null;
}

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { t } = useTranslation();

  const m = user?.membership;
  const badgeColor = m?.club.tagBadgeColor || '#1565c0';
  const highlightColor = m?.club.tagBadgeHighlightColor || '#0d47a1';

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.getMembers();
        setMembers(res.data);
      } catch {
        setError(t('members.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [t]);

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, search]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h4">
          {t('members.title')}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
            {members.length}
          </Typography>
        </Typography>
      </Box>

      {members.length === 0 ? (
        <Alert severity="info">{t('members.empty')}</Alert>
      ) : (
        <>
          <TextField
            size="small"
            placeholder={t('members.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2, maxWidth: 320 }}
            fullWidth
          />
          <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 60 }} align="center">Tag</TableCell>
                      <TableCell>{t('members.name')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((member) => (
                      <TableRow key={member.iDiscGolfId} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <TagBadge
                              number={member.tagNumber}
                              size="small"
                              badgeColor={badgeColor}
                              highlightColor={highlightColor}
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {member.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75, flexWrap: 'wrap' }}>
                            <Chip
                              label={`DGOLF #${member.iDiscGolfId}`}
                              size="small"
                              component="a"
                              href={`https://www.dgolf.cz/cs/players/${member.iDiscGolfId}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: '#e8f5e9',
                                color: '#2e7d32',
                                '&:hover': { bgcolor: '#c8e6c9' },
                              }}
                            />
                            {member.pdgaNumber && (
                              <Chip
                                label={`PDGA #${member.pdgaNumber}`}
                                size="small"
                                component="a"
                                href={`https://www.pdga.com/player/${member.pdgaNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                clickable
                                sx={{
                                  height: 22,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  bgcolor: '#e3f2fd',
                                  color: '#1565c0',
                                  '&:hover': { bgcolor: '#bbdefb' },
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default MembersPage;
