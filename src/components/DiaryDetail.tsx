import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppDispatch } from "../store/hooks";
import { deleteDiary } from "../store/diarySlice";
import { diaryDB } from "../database/db";
import { MOODS } from "../constants";
import { type Diary, type MoodLevel, type PhotoItem } from "../types";
import PhotoGallery from "./PhotoGallery";
import { generateMoodImage } from '../utils/moodImageGenerator';


function DiaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [allImages, setAllImages] = useState<PhotoItem[]>([]);

  useEffect(() => {
    if (id) {
      loadDiary();
    }
  }, [id]);

  const loadDiary = async () => {
    const diaryData = await diaryDB.getById(id!);
    if (diaryData) {
      setDiary(diaryData);
      
      // 気分画像を生成して写真と統合
      const moodImageSrc = await generateMoodImage(diaryData.mood, diaryData.moodDetails);
      const images: PhotoItem[] = [];
      
      if (moodImageSrc) {
        images.push({ src: moodImageSrc, type: 'mood' });
      }
      
      diaryData.photos?.forEach((photo) => {
        images.push({ src: photo, type: 'photo' });
      });
      
      setAllImages(images);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      await dispatch(deleteDiary(id));
      navigate("/", { replace: true });
    }
  };

  const handleCopyContent = async () => {
    if (diary?.content) {
      try {
        await navigator.clipboard.writeText(diary.content);
        setSnackbarMessage("本文をコピーしました");
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage("コピーに失敗しました");
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

  const moodOption = MOODS[diary.mood as MoodLevel];

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          日記の詳細
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box mb={3}>
            <Typography variant="h6">
            {format(new Date(diary.date), 'yyyy年MM月dd日 (E)', { locale: ja })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {format(new Date(diary.date), 'HH:mm')}
            </Typography>
        </Box>

        {diary.tags && diary.tags.length > 0 && (
          <Box mb={3}>
            {diary.tags.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        )}

        {allImages.length > 0 && (
          <Box mb={3}>
            <PhotoGallery
              photos={allImages} 
              columns={allImages.length === 1 ? 1 : allImages.length === 2 ? 2 : 3}
              height={allImages.length === 1 ? 300 : 200}
            />
          </Box>
        )}

        <Box mb={3}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
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
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
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
