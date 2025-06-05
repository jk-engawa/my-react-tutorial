// 画像のリサイズ設定
const IMAGE_CONFIG = {
  maxWidth: 1200,  // iPhone Pro Maxの幅でも十分な解像度
  maxHeight: 1200,
  quality: 0.8,    // 80%の品質（ファイルサイズと画質のバランス）
};

// 画像をリサイズ
const resizeImage = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(base64);
        return;
      }

      // アスペクト比を保持しながらリサイズ
      let { width, height } = img;
      const { maxWidth, maxHeight } = IMAGE_CONFIG;

      // 画像が既に小さい場合はリサイズしない
      if (width <= maxWidth && height <= maxHeight) {
        resolve(base64);
        return;
      }

      // アスペクト比を計算
      const aspectRatio = width / height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // canvasのサイズを設定
      canvas.width = width;
      canvas.height = height;

      // 画像を描画
      ctx.drawImage(img, 0, 0, width, height);

      // リサイズした画像をBase64に変換
      resolve(canvas.toDataURL('image/jpeg', IMAGE_CONFIG.quality));
    };

    img.src = base64;
  });
};

// 画像をBase64に変換
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      // リサイズしてから返す
      const resized = await resizeImage(base64);
      resolve(resized);
    };
    reader.onerror = error => reject(error);
  });
};

// 複数の画像ファイルをBase64に変換
export const convertMultipleToBase64 = async (files: FileList): Promise<string[]> => {
  const promises = Array.from(files).map(file => convertToBase64(file));
  return await Promise.all(promises);
};

// ファイルサイズを取得（デバッグ用）
export const getImageFileSize = (base64: string): string => {
  const sizeInBytes = Math.round(base64.length * 0.75); // Base64は約33%大きい
  const sizeInKB = sizeInBytes / 1024;
  const sizeInMB = sizeInKB / 1024;
  
  if (sizeInMB > 1) {
    return `${sizeInMB.toFixed(2)} MB`;
  }
  return `${sizeInKB.toFixed(0)} KB`;
};