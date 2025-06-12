import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  LocalOffer as TagIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDiaries, setSelectedTag } from "../store/diarySlice";
import { MOODS, SAMPLE_TAGS } from "../constants";
import PhotoThumbnail from "./PhotoThumbnail";
import { type Diary, type MoodLevel, type PhotoItem } from "../types";
import { generateMoodImage } from '../utils/moodImageGenerator';
import PhotoThumbnailExtended from './PhotoThumbnailExtended';


function DiaryList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { diaries, loading, selectedTag } = useAppSelector(
    (state) => state.diary,
  );
  const [diaryImages, setDiaryImages] = useState<Record<string, PhotoItem[]>>({});
  
  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  // 各日記の気分画像を生成
  useEffect(() => {
    const generateImages = async () => {
      const images: Record<string, PhotoItem[]> = {};
      
      for (const diary of diaries) {
        const items: PhotoItem[] = [];
        
        // 気分画像を生成
        const moodImageSrc = await generateMoodImage(diary.mood, diary.moodDetails);
        if (moodImageSrc) {
          items.push({ src: moodImageSrc, type: 'mood' });
        }
        
        // 写真を追加
        diary.photos?.forEach((photo) => {
          items.push({ src: photo, type: 'photo' });
        });
        
        images[diary.id] = items;
      }
      
      setDiaryImages(images);
    };
    
    if (diaries.length > 0) {
      generateImages();
    }
  }, [diaries]);

  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  // 使用されているタグを収集
  const usedTags = useMemo(() => {
    const tagSet = new Set<string>();
    diaries.forEach((diary) => {
      diary.tags?.forEach((tag) => {
        if (tag !== "ALL") {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet);
  }, [diaries]);

  // 選択されたタグでフィルタリング
  const filteredDiaries = useMemo(() => {
    if (selectedTag === "ALL") {
      return diaries;
    }
    return diaries.filter((diary) => diary.tags?.includes(selectedTag));
  }, [diaries, selectedTag]);

  // 日付でグルーピング
  const groupedDiaries = useMemo(() => {
    const groups: { [key: string]: Diary[] } = {};

    filteredDiaries.forEach((diary) => {
      const dateKey = format(new Date(diary.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(diary);
    });

    // 各グループ内で時間順にソート
    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    return groups;
  }, [filteredDiaries]);

  // ソートされた日付キー
  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedDiaries).sort((a, b) => b.localeCompare(a));
  }, [groupedDiaries]);

  const handleNewDiary = () => {
    navigate("/new");
  };

  const handleDiaryClick = (id: string) => {
    navigate(`/diary/${id}`);
  };

  const handleTagChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTag: string,
  ) => {
    if (newTag !== null) {
      dispatch(setSelectedTag(newTag));
    }
  };

  // 本文を最大20文字に制限
  const truncateContent = (content: string, maxLength: number = 20) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
            <TagIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="subtitle1">タグで絞り込み</Typography>
          </Box>
          <ToggleButtonGroup
            value={selectedTag}
            exclusive
            onChange={handleTagChange}
            aria-label="tag filter"
            sx={{ flexWrap: "wrap", gap: 0.5 }}
          >
            <ToggleButton value="ALL" aria-label="all">
              ALL
            </ToggleButton>
            {usedTags.map((tag) => (
              <ToggleButton key={tag} value={tag} aria-label={tag}>
                {tag}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>
      )}

      {selectedTag && selectedTag !== "ALL" && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          「{selectedTag}」タグの日記: {filteredDiaries.length}件
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
          <DescriptionIcon
            sx={{ fontSize: 120, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" color="text.secondary">
            {selectedTag !== "ALL"
              ? "該当する日記が見つかりません"
              : "日記を書いてみよう！"}
          </Typography>
        </Box>
      ) : (
        <Box>
          {sortedDateKeys.map((dateKey) => (
            <Box key={dateKey} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                {format(new Date(dateKey), "yyyy年MM月dd日 (E)", {
                  locale: ja,
                })}
              </Typography>

              <Grid container spacing={2}>
                {groupedDiaries[dateKey].map((diary) => (
                  <Grid size={12} key={diary.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        "&:hover": { boxShadow: 4 },
                        position: "relative",
                      }}
                      onClick={() => handleDiaryClick(diary.id!)}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <TimeIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {format(new Date(diary.date), "HH:mm")}
                            </Typography>
                          </Box>
                        </Box>

                        {diary.tags && diary.tags.length > 0 && (
                          <Box mb={1}>
                            {diary.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ mr: 1 }}
                                color={
                                  selectedTag === tag ? "primary" : "default"
                                }
                              />
                            ))}
                          </Box>
                        )}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: diary.photos && diary.photos.length > 0 ? 1 : 0,
                          }}
                        >
                          {truncateContent(diary.content)}
                        </Typography>

                        {diaryImages[diary.id] && diaryImages[diary.id].length > 0 && (
                          <Box mt={1}>
                            <PhotoThumbnailExtended photos={diaryImages[diary.id]} />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleNewDiary}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default DiaryList;
