import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Fab,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiaries } from '../store/diarySlice';
import { MOODS } from '../constants';

function DiaryList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { diaries, loading } = useAppSelector((state) => state.diary);

  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  const handleNewDiary = () => {
    navigate('/new');
  };

  const handleDiaryClick = (id: number) => {
    navigate(`/diary/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        日記一覧
      </Typography>

      {diaries.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
        >
          <DescriptionIcon sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            日記を書いてみよう！
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {diaries.map((diary) => (
            <Grid size={12} key={diary.id}>
              <Card
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => handleDiaryClick(diary.id!)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      {format(new Date(diary.date), 'yyyy年MM月dd日 (E)', { locale: ja })}
                    </Typography>
                    <Typography variant="h4">
                      {MOODS[diary.mood]?.icon || '😐'}
                    </Typography>
                  </Box>

                  {diary.tags && diary.tags.length > 0 && (
                    <Box mb={2}>
                      {diary.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {diary.content}
                  </Typography>

                  {diary.photos && diary.photos.length > 0 && (
                    <Box display="flex" gap={1} mt={2}>
                      {diary.photos.slice(0, 2).map((photo, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={photo}
                          alt={`写真${index + 1}`}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                      {diary.photos.length > 2 && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            +{diary.photos.length - 2}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleNewDiary}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default DiaryList;