import { type MoodType, type MoodOption } from '../types';

// 気持ちを表すアイコンの定義
export const MOODS: Record<MoodType, MoodOption> = {
  happy: { icon: '😊', label: 'うれしい' },
  neutral: { icon: '😐', label: 'ふつう' },
  sad: { icon: '😢', label: 'かなしい' }
};

// サンプルタグ
export const SAMPLE_TAGS: string[] = [
  '仕事',
  '家族',
  '趣味',
  '健康',
  '勉強'
];