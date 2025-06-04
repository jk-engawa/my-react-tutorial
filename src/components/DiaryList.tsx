import { useEffect, useMemo } from 'react';
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
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  LocalOffer as TagIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiaries, toggleTag, clearSelectedTags } from '../store/diarySlice';
import { MOODS, SAMPLE_TAGS } from '../constants';
import PhotoThumbnail from './PhotoThumbnail';

function DiaryList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { diaries, loading, selectedTags } = useAppSelector((state) => state.diary);

  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  // 使用されているタグを収集
  const usedTags = useMemo(() => {
    const tagSet = new Set<string>();
    diaries.forEach(diary => {
      diary.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [diaries]);

  // 選択されたタグでフィルタリング
  const filteredDiaries = useMemo(() => {
    if (selectedTags.length === 0) {
      return diaries;
    }
    return diaries.filter(diary => 
      selectedTags.some(tag => diary.tags?.includes(tag))
    );
  }, [diaries, selectedTags]);

  const handleNewDiary = () => {
    navigate('/new');
  };

  const handleDiaryClick = (id: number) => {
    navigate(`/diary/${id}`);
  };

  const handleTagToggle = (tag: string) => {
    dispatch(toggleTag(tag));
  };

  const handleClearTags = () => {
    dispatch(clearSelectedTags());
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

      {/* タグフィルター */}
      {usedTags.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              タグで絞り込み
            </Typography>
            {selectedTags.length > 0 && (
              <Chip
                label="クリア"
                size="small"
                icon={<ClearIcon />}
                onClick={handleClearTags}
                color="secondary"
              />
            )}
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {usedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Paper>
      )}

      {selectedTags.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredDiaries.length}件の日記が見つかりました
        </Typography>
      )}

      {filteredDiaries.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
        >
          <DescriptionIcon sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            {selectedTags.length > 0 
              ? '該当する日記が見つかりません' 
              : '日記を書いてみよう！'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDiaries.map((diary) => (
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
                          color={selectedTags.includes(tag) ? 'primary' : 'default'}
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
                    <Box mt={2}>
                      <PhotoThumbnail photos={diary.photos} />
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