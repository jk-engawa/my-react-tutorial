import { useState } from "react";
import { Box, ImageList, ImageListItem, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PhotoGalleryProps {
  photos: string[];
  columns?: number;
  gap?: number;
  height?: number | string;
  editable?: boolean;
  onRemove?: (index: number) => void;
}

function PhotoGallery({
  photos,
  columns = 3,
  gap = 8,
  height = 200,
  editable = false,
  onRemove,
}: PhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemove?.(index);
  };

  const slides = photos.map((photo) => ({ src: photo }));

  // 写真の数に応じてカラム数を調整
  const actualColumns =
    photos.length === 1 ? 1 : photos.length === 2 ? 2 : columns;

  return (
    <>
      <ImageList cols={actualColumns} gap={gap} sx={{ height: height }}>
        {photos.map((photo, index) => (
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
              src={photo}
              alt={`写真${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 4,
              }}
              onClick={() => handlePhotoClick(index)}
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

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  );
}

export default PhotoGallery;
