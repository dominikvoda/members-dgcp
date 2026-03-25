import React, { useEffect, useState } from 'react';
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
  Chip,
  IconButton,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { api } from '../api/client';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      <Typography variant="h4" gutterBottom>{t('members.title')}</Typography>
      {members.length === 0 ? (
        <Alert severity="info">{t('members.empty')}</Alert>
      ) : (
        <Card>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('members.name')}</TableCell>
                    <TableCell>iDiscGolf</TableCell>
                    <TableCell>PDGA</TableCell>
                    <TableCell align="center">Tag</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.iDiscGolfId}>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          component="a"
                          href={`https://www.idiscgolf.eu/player/${m.iDiscGolfId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {m.pdgaNumber ? (
                          <IconButton
                            size="small"
                            component="a"
                            href={`https://www.pdga.com/player/${m.pdgaNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        ) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {m.tagNumber ? (
                          <Chip label={`#${m.tagNumber}`} color="primary" size="small" />
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MembersPage;
