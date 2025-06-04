// 画像をBase64に変換
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 複数の画像ファイルをBase64に変換
export const convertMultipleToBase64 = async (files: FileList): Promise<string[]> => {
  const promises = Array.from(files).map(file => convertToBase64(file));
  return await Promise.all(promises);
};