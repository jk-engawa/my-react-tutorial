import { useState } from "react";
import { Box, ImageList, ImageListItem, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { type PhotoType, type PhotoItem } from "../types";

interface PhotoGalleryProps {
  photos: string[] | PhotoItem[];
  columns?: number;
  gap?: number;
  height?: number | string;
  editable?: boolean;
  onRemove?: (index: number) => void;
  onMoodClick?: () => void;
}

function PhotoGallery({
  photos,
  columns = 3,
  gap = 8,
  height = 200,
  editable = false,
  onRemove,
  onMoodClick
}: PhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // photosを統一形式に変換
  const normalizedPhotos: PhotoItem[] = photos.map((photo, index) => {
    if (typeof photo === 'string') {
      return { src: photo, type: 'photo' as PhotoType, index };
    }
    return { ...photo, index: photo.index ?? index };
  });

  // Lightbox用の写真のみを抽出
  const lightboxPhotos = normalizedPhotos
    .filter(item => item.type === 'photo')
    .map(item => ({ src: item.src }));

  const handlePhotoClick = (item: PhotoItem) => {
    if (item.type === 'mood' && onMoodClick) {
      onMoodClick();
    } else if (item.type === 'photo') {
      // 写真の中での実際のインデックスを計算
      const photoOnlyIndex = normalizedPhotos
        .slice(0, item.index)
        .filter(p => p.type === 'photo').length;
      setPhotoIndex(photoOnlyIndex);
    setOpen(true);
    }
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemove?.(index);
  };

  // 写真の数に応じてカラム数を調整
  const actualColumns = normalizedPhotos.length === 1 ? 1 : normalizedPhotos.length === 2 ? 2 : columns;

  return (
    <>
      <ImageList cols={actualColumns} gap={gap} sx={{ height: height }}>
        {normalizedPhotos.map((item, index) => (
          <ImageListItem
            key={index}
            sx={{
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              "& img": {
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              },
            }}
          >
            <img
              src={item.src}
              alt={item.type === 'mood' ? '気分' : `写真${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 4,
              }}
              onClick={() => handlePhotoClick(item)}
            />
            {editable && onRemove && (
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
                onClick={(e) => handleRemove(e, index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {lightboxPhotos.length > 0 && (
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
          slides={lightboxPhotos}
      />
      )}
    </>
  );
}

export default PhotoGallery;