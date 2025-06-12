import { MOODS } from '../constants';
import { type MoodLevel } from '../types';

export const generateMoodImage = (mood: number, moodDetails?: string[]): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    // キャンバスサイズ
    const width = 300;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    // 背景をピンクに
    ctx.fillStyle = '#FFC0CB';
    ctx.fillRect(0, 0, width, height);

    // 角丸の四角形を描画
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // 白い背景の角丸四角形
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    roundRect(10, 10, width - 20, height - 20, 10);
    ctx.fill();

    // 気分の情報を取得
    const moodOption = MOODS[mood as MoodLevel];

    // 絵文字を描画
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(moodOption.icon, width / 2, 60);

    // 気分のラベルを描画
    ctx.font = 'bold 20px "Noto Sans JP", sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(moodOption.label, width / 2, 100);

    // 詳細な気持ちを描画
    if (moodDetails && moodDetails.length > 0) {
      ctx.font = '14px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#666';
      const detailsText = moodDetails.join('、');
      
      // テキストが長い場合は省略
      const maxWidth = width - 40;
      let displayText = detailsText;
      if (ctx.measureText(detailsText).width > maxWidth) {
        while (ctx.measureText(displayText + '...').width > maxWidth && displayText.length > 0) {
          displayText = displayText.slice(0, -1);
        }
        displayText += '...';
      }
      
      ctx.fillText(displayText, width / 2, 140);
    }

    // データURLとして出力
    resolve(canvas.toDataURL('image/png'));
  });
};