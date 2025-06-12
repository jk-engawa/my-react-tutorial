import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { type PhotoItem } from '../types';

interface PhotoThumbnailExtendedProps {
  photos: PhotoItem[];
  maxDisplay?: number;
  size?: number;
}

function PhotoThumbnailExtended({ photos, maxDisplay = 2, size = 60 }: PhotoThumbnailExtendedProps) {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // 写真のみを抽出（Lightbox用）
  const photoOnlyItems = photos.filter(item => item.type === 'photo');
  const slides = photoOnlyItems.map((item) => ({ src: item.src }));

  const handlePhotoClick = (index: number) => {
    const clickedItem = photos[index];
    if (clickedItem.type === 'photo') {
      // クリックされた写真の、写真のみの中でのインデックスを計算
      const photoOnlyIndex = photos.slice(0, index).filter(p => p.type === 'photo').length;
      setPhotoIndex(photoOnlyIndex);
      setOpen(true);
    }
    // 気分画像の場合は何もしない（サムネイルでは気分選択モーダルは開かない）
  };

  return (
    <>
      <Box display="flex" gap={1}>
        {photos.slice(0, maxDisplay).map((item, index) => (
          <Box
            key={index}
            component="img"
            src={item.src}
            alt={item.type === 'mood' ? '気分' : `写真${index + 1}`}
            sx={{
              width: size,
              height: size,
              objectFit: 'cover',
              borderRadius: 1,
              cursor: item.type === 'photo' ? 'pointer' : 'default',
              transition: 'transform 0.2s ease',
              '&:hover': item.type === 'photo' ? {
                transform: 'scale(1.05)',
              } : {},
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
              backgroundColor: 'grey.300',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'grey.400',
              },
            }}
            onClick={() => {
              // +nをクリックした場合、maxDisplay番目の画像を開く
              const item = photos[maxDisplay];
              if (item?.type === 'photo') {
                const photoOnlyIndex = photos.slice(0, maxDisplay).filter(p => p.type === 'photo').length;
                setPhotoIndex(photoOnlyIndex);
                setOpen(true);
              }
            }}
          >
            <Typography variant="body2" color="text.secondary">
              +{photos.length - maxDisplay}
            </Typography>
          </Box>
        )}
      </Box>

      {photoOnlyItems.length > 0 && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={slides}
        />
      )}
    </>
  );
}

export default PhotoThumbnailExtended;