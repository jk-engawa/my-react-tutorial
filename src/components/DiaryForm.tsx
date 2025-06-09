import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  IconButton,
  Paper,
  Grid,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Mood as MoodIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PickersTextField } from "@mui/x-date-pickers";
import { ja } from "date-fns/locale";
import { useAppDispatch } from "../store/hooks";
import { addDiary, updateDiary } from "../store/diarySlice";
import { MOODS, SAMPLE_TAGS } from "../constants";
import { convertToBase64 } from "../utils/imageHandler";
import { diaryDB } from "../database/db";
import { type MoodLevel, type Diary } from "../types";
import PhotoGallery from "./PhotoGallery";
import ImageUploadInfo from "./ImageUploadInfo";
import MoodSelector from "./MoodSelector";
import { v4 as uuidv4 } from "uuid";

function DiaryForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [mood, setMood] = useState<number>(3);
  const [moodDetails, setMoodDetails] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoMenuAnchor, setPhotoMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const [existingDiary, setExistingDiary] = useState<Diary | null>(null);

  useEffect(() => {
    if (id) {
      loadDiary();
    }
    // 自由記述欄にフォーカス
    setTimeout(() => {
      contentInputRef.current?.focus();
    }, 100);
  }, [id]);

  const loadDiary = async () => {
    const diary = await diaryDB.getById(id!);
    if (diary) {
      setDateTime(new Date(diary.date));
      setMood(diary.mood);
      setMoodDetails(diary.moodDetails);
      setSelectedTags(diary.tags || []);
      setContent(diary.content);
      setPhotos(diary.photos || []);
    }
  };

  const handleMoodConfirm = (newMood: number, newMoodDetails: string[]) => {
    setMood(newMood);
    setMoodDetails(newMoodDetails);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handlePhotoMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPhotoMenuAnchor(event.currentTarget);
  };

  const handlePhotoMenuClose = () => {
    setPhotoMenuAnchor(null);
  };

  const handlePhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsProcessingImages(true);
      setProcessedCount(0);
      setTotalCount(files.length);

      try {
        const base64Photos: string[] = [];

        // 1枚ずつ処理して進捗を表示
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const base64 = await convertToBase64(file);
          base64Photos.push(base64);
          setProcessedCount(i + 1);
        }

        setPhotos((prev) => [...prev, ...base64Photos]);
      } finally {
        setIsProcessingImages(false);
        setProcessedCount(0);
        setTotalCount(0);
      }
    }
    handlePhotoMenuClose();
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!dateTime) return;

    const diaryData: Diary = {
      id: id || uuidv4(), // 編集時は既存ID、新規時は新しいUUID
      date: dateTime.toISOString(),
      mood,
      moodDetails: moodDetails.length > 0 ? moodDetails : [],
      tags: selectedTags,
      content,
      photos,
      createdAt: existingDiary?.createdAt, // 既存の場合は保持
      updatedAt: existingDiary?.updatedAt, // DBで更新される
    };

    if (existingDiary?.createdAt) {
      // 既存日記の更新（createdAtが存在する）
      await dispatch(updateDiary({ id: diaryData.id, data: diaryData }));
    } else {
      // 新規日記の作成（createdAtが存在しない）
      await dispatch(addDiary(diaryData));
    }

    navigate("/", { replace: true });
  };

  const currentMoodOption = MOODS[mood as MoodLevel];

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? "日記を編集" : "新しい日記"}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          写真は自動的にiPhoneに最適なサイズに調整されます（最大1200px、品質80%）
        </Alert>
        <Box sx={{ mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DateTimePicker
              label="日時"
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
              slots={{
                textField: (pickerFieldProps) => (
                  <PickersTextField {...pickerFieldProps} fullWidth />
                ),
              }}
              format="yyyy年MM月dd日 HH:mm"
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            今日の気分
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setMoodSelectorOpen(true)}
            startIcon={<MoodIcon />}
            sx={{
              justifyContent: "flex-start",
              py: 1.5,
              textTransform: "none",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Typography variant="h5">{currentMoodOption.icon}</Typography>
              <Box>
                <Typography variant="body1">
                  {currentMoodOption.label}
                </Typography>
                {moodDetails.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {moodDetails.join("、")}
                  </Typography>
                )}
              </Box>
            </Box>
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            タグ
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {SAMPLE_TAGS.filter((tag) => tag !== "ALL").map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                onClick={() => handleTagToggle(tag)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="日記の内容"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            inputRef={contentInputRef}
            autoFocus={!id}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            写真
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={handlePhotoMenuOpen}
              disabled={isProcessingImages}
            >
              写真を追加
            </Button>
            <Menu
              anchorEl={photoMenuAnchor}
              open={Boolean(photoMenuAnchor)}
              onClose={handlePhotoMenuClose}
            >
              <MenuItem onClick={() => cameraInputRef.current?.click()}>
                写真を撮る
              </MenuItem>
              <MenuItem onClick={() => fileInputRef.current?.click()}>
                アルバムから選択
              </MenuItem>
            </Menu>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handlePhotoSelect}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handlePhotoSelect}
            />
          </Box>

          <ImageUploadInfo
            isProcessing={isProcessingImages}
            processedCount={processedCount}
            totalCount={totalCount}
          />

          {photos.length > 0 && (
            <Box mt={2}>
              <PhotoGallery
                photos={photos}
                columns={3}
                height={photos.length === 1 ? 300 : 200}
                editable={true}
                onRemove={handleRemovePhoto}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                ※ 画像は自動的に最適化されます
              </Typography>
            </Box>
          )}
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            fullWidth
          >
            保存
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")} fullWidth>
            キャンセル
          </Button>
        </Box>
      </Paper>

      <MoodSelector
        open={moodSelectorOpen}
        onClose={() => setMoodSelectorOpen(false)}
        currentMood={mood}
        currentMoodDetails={moodDetails}
        onConfirm={handleMoodConfirm}
      />
    </Container>
  );
}

export default DiaryForm;
