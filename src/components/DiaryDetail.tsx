import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAppDispatch } from '../store/hooks';
import { deleteDiary } from '../store/diarySlice';
import { diaryDB } from '../database/db';
import { MOODS } from '../constants';
import { type Diary } from '../types';
import PhotoGallery from './PhotoGallery';

function DiaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadDiary();
    }
  }, [id]);

  const loadDiary = async () => {
    const diaryData = await diaryDB.getById(Number(id));
    if (diaryData) {
      setDiary(diaryData);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      await dispatch(deleteDiary(Number(id)));
      navigate('/', { replace: true });
    }
  };

  const handleCopyContent = async () => {
    if (diary?.content) {
      try {
        await navigator.clipboard.writeText(diary.content);
        setSnackbarMessage('本文をコピーしました');
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage('コピーに失敗しました');
        setSnackbarOpen(true);
      }
    }
  };

  if (!diary) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          日記の詳細
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            {format(new Date(diary.date), 'yyyy年MM月dd日 (E)', { locale: ja })}
          </Typography>
          <Typography variant="h3">
            {MOODS[diary.mood]?.icon || '😐'}
          </Typography>
        </Box>

        {diary.tags && diary.tags.length > 0 && (
          <Box mb={3}>
            {diary.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        {diary.photos && diary.photos.length > 0 && (
          <Box mb={3}>
            <PhotoGallery 
              photos={diary.photos} 
              columns={diary.photos.length === 1 ? 1 : diary.photos.length === 2 ? 2 : 3}
              height={diary.photos.length === 1 ? 300 : 200}
                  />
          </Box>
        )}

        <Box mb={3}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {diary.content}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={handleCopyContent}
            fullWidth
          >
            本文をコピー
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            fullWidth
          >
            編集
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            fullWidth
          >
            削除
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>日記を削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は取り消すことができません。本当に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default DiaryDetail;