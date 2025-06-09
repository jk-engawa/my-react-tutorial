export interface Diary {
  id: string; // UUIDに変更
  date: string;
  mood: number; // 1-5の数値に変更
  moodDetails: string[]; // 詳細な気持ち
  tags: string[];
  content: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  icon: string;
  label: string;
  details: string[];
}

export interface DiaryState {
  diaries: Diary[];
  loading: boolean;
  error: string | null;
  selectedTag: string; // ALLまたは特定のタグ
}
