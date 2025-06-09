import { Box, Typography, LinearProgress } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

interface ImageUploadInfoProps {
  isProcessing: boolean;
  processedCount?: number;
  totalCount?: number;
}

function ImageUploadInfo({
  isProcessing,
  processedCount = 0,
  totalCount = 0,
}: ImageUploadInfoProps) {
  if (!isProcessing) return null;

  const progress = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <InfoIcon fontSize="small" color="info" />
        <Typography variant="body2" color="text.secondary">
          画像を最適化しています... ({processedCount}/{totalCount})
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default ImageUploadInfo;
