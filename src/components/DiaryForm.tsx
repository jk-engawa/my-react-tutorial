import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
import {
    PhotoCamera as PhotoCameraIcon,
    Close as CloseIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersTextField } from '@mui/x-date-pickers';
import { ja } from 'date-fns/locale';
import { useAppDispatch } from '../store/hooks';
import { addDiary, updateDiary } from '../store/diarySlice';
import { MOODS, SAMPLE_TAGS } from '../constants';
import { convertMultipleToBase64 } from '../utils/imageHandler';
import { diaryDB } from '../database/db';
import { type MoodType } from '../types';

function DiaryForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [date, setDate] = useState<Date | null>(new Date());
    const [mood, setMood] = useState<MoodType>('neutral');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [photoMenuAnchor, setPhotoMenuAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (id) {
            loadDiary();
        }
    }, [id]);

    const loadDiary = async () => {
        const diary = await diaryDB.getById(Number(id));
        if (diary) {
            setDate(new Date(diary.date));
            setMood(diary.mood);
            setSelectedTags(diary.tags || []);
            setContent(diary.content);
            setPhotos(diary.photos || []);
        }
    };

    const handleMoodChange = (_event: React.MouseEvent<HTMLElement>, newMood: MoodType | null) => {
        if (newMood !== null) {
            setMood(newMood);
        }
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
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
            const base64Photos = await convertMultipleToBase64(files);
            setPhotos((prev) => [...prev, ...base64Photos]);
        }
        handlePhotoMenuClose();
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!date) return;

        const diaryData = {
            date: date.toISOString(),
            mood,
            tags: selectedTags,
            content,
            photos,
        };

        if (id) {
            await dispatch(updateDiary({ id: Number(id), data: diaryData }));
        } else {
            await dispatch(addDiary(diaryData));
        }

        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {id ? '日記を編集' : '新しい日記'}
            </Typography>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                        <DatePicker
                            label="日付"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            slots={{ textField: (pickerFieldProps) => <PickersTextField {...pickerFieldProps} fullWidth /> }}
                        />
                    </LocalizationProvider>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        今日の気分
                    </Typography>
                    <ToggleButtonGroup
                        value={mood}
                        exclusive
                        onChange={handleMoodChange}
                        fullWidth
                    >
                        {(Object.entries(MOODS) as [MoodType, typeof MOODS[MoodType]][]).map(([key, value]) => (
                            <ToggleButton key={key} value={key}>
                                <Box>
                                    <Typography variant="h4">{value.icon}</Typography>
                                    <Typography variant="caption" display="block">
                                        {value.label}
                                    </Typography>
                                </Box>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        タグ
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {SAMPLE_TAGS.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                                onClick={() => handleTagToggle(tag)}
                            />
                        ))}
                    </Box>
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
                            style={{ display: 'none' }}
                            onChange={handlePhotoSelect}
                        />
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                            onChange={handlePhotoSelect}
                        />
                    </Box>

                    {photos.length > 0 && (
                        <Grid container spacing={1} sx={{ mt: 2 }}>
                            {photos.slice(0, 2).map((photo, index) => (
                                <Grid size={6} key={index}>
                                    <Box position="relative" />
                                    <Box
                                        component="img"
                                        src={photo}
                                        alt={`写真${index + 1}`}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            backgroundColor: 'background.paper',
                                        }}
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Grid>


                                // <Grid item key={index}>
                                //   <Box position="relative">
                                //     <Box
                                //       component="img"
                                //       src={photo}
                                //       alt={`写真${index + 1}`}
                                //       sx={{
                                //         width: 100,
                                //         height: 100,
                                //         objectFit: 'cover',
                                //         borderRadius: 1,
                                //       }}
                                //     />
                                //     <IconButton
                                //       size="small"
                                //       sx={{
                                //         position: 'absolute',
                                //         top: -8,
                                //         right: -8,
                                //         backgroundColor: 'background.paper',
                                //       }}
                                //       onClick={() => handleRemovePhoto(index)}
                                //     >
                                //       <CloseIcon fontSize="small" />
                                //     </IconButton>
                                //   </Box>
                                // </Grid>
                            ))}
                            {photos.length > 2 && (
                                <Grid size={6}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            backgroundColor: 'grey.200',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            +{photos.length - 2}
                                        </Typography>
                                    </Box>
                                </Grid>

                                // <Grid item>
                                //     <Box
                                //         display="flex"
                                //         alignItems="center"
                                //         justifyContent="center"
                                //         sx={{
                                //             width: 100,
                                //             height: 100,
                                //             backgroundColor: 'grey.200',
                                //             borderRadius: 1,
                                //         }}
                                //     >
                                //         <Typography variant="body1">
                                //             +{photos.length - 2}
                                //         </Typography>
                                //     </Box>
                                // </Grid>
                            )}
                        </Grid>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="日記の内容"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                    />
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
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        fullWidth
                    >
                        キャンセル
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default DiaryForm;