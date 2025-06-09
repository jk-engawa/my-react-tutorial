import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { MOODS, MOOD_MARKS } from "../constants";
import { type MoodLevel } from "../types";

interface MoodSelectorProps {
  open: boolean;
  onClose: () => void;
  currentMood: number;
  currentMoodDetails?: string[];
  onConfirm: (mood: number, moodDetails: string[]) => void;
}

function MoodSelector({
  open,
  onClose,
  currentMood,
  currentMoodDetails,
  onConfirm,
}: MoodSelectorProps) {
  const [mood, setMood] = useState<number>(currentMood);
  const [moodDetails, setMoodDetails] = useState<string[]>(
    currentMoodDetails || [],
  );

  useEffect(() => {
    setMood(currentMood);
    setMoodDetails(currentMoodDetails || []);
  }, [currentMood, currentMoodDetails, open]);

  const handleMoodChange = (_event: Event, newValue: number | number[]) => {
    const newMood = newValue as number;
    setMood(newMood);
    // 気持ちが変わったら詳細な気持ちをリセット
    if (newMood !== currentMood) {
      setMoodDetails([]);
    }
  };

  const handleDetailToggle = (detail: string) => {
    setMoodDetails((prev) =>
      prev.includes(detail)
        ? prev.filter((d) => d !== detail)
        : [...prev, detail],
    );
  };

  const handleConfirm = () => {
    onConfirm(mood, moodDetails.length > 0 ? moodDetails : []);
    onClose();
  };

  const currentMoodOption = MOODS[mood as MoodLevel];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">今の気持ちを選択</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ px: 2, py: 3 }}>
          {/* 現在の気分アイコン */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h1" sx={{ fontSize: 80 }}>
              {currentMoodOption.icon}
            </Typography>
            <Typography variant="h6" color="text.secondary" mt={1}>
              {currentMoodOption.label}
            </Typography>
          </Box>

          {/* スライダー */}
          <Box sx={{ px: 3, mb: 4 }}>
            <Slider
              value={mood}
              onChange={handleMoodChange}
              min={1}
              max={5}
              step={1}
              marks={MOOD_MARKS}
              sx={{
                "& .MuiSlider-thumb": {
                  width: 28,
                  height: 28,
                },
                "& .MuiSlider-mark": {
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                },
              }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              {Object.entries(MOODS).map(([key, value]) => (
                <Typography
                  key={key}
                  variant="caption"
                  sx={{
                    width: "20%",
                    textAlign: "center",
                    color:
                      mood === Number(key) ? "primary.main" : "text.secondary",
                  }}
                >
                  {value.icon}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* 詳細な気持ちの選択 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              詳細な気持ち（複数選択可）
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {currentMoodOption.details.map((detail) => (
                <Chip
                  key={detail}
                  label={detail}
                  onClick={() => handleDetailToggle(detail)}
                  color={moodDetails.includes(detail) ? "primary" : "default"}
                  variant={moodDetails.includes(detail) ? "filled" : "outlined"}
                />
              ))}
            </Box>
            {moodDetails.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                選択中: {moodDetails.join("、")}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MoodSelector;
