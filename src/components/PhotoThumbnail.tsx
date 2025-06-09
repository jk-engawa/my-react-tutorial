import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PhotoThumbnailProps {
  photos: string[];
  maxDisplay?: number;
  size?: number;
}

function PhotoThumbnail({
  photos,
  maxDisplay = 2,
  size = 60,
}: PhotoThumbnailProps) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  const slides = photos.map((photo) => ({ src: photo }));

  return (
    <>
      <Box display="flex" gap={1}>
        {photos.slice(0, maxDisplay).map((photo, index) => (
          <Box
            key={index}
            component="img"
            src={photo}
            alt={`写真${index + 1}`}
            sx={{
              width: size,
              height: size,
              objectFit: "cover",
              borderRadius: 1,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handlePhotoClick(index)}
          />
        ))}
        {photos.length > maxDisplay && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: size,
              height: size,
              backgroundColor: "grey.300",
              borderRadius: 1,
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "grey.400",
              },
            }}
            onClick={() => handlePhotoClick(maxDisplay)}
          >
            <Typography variant="body2" color="text.secondary">
              +{photos.length - maxDisplay}
            </Typography>
          </Box>
        )}
      </Box>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  );
}

export default PhotoThumbnail;
