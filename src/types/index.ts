export interface Diary {
  id?: number;
  date: string;
  mood: MoodType;
  tags: string[];
  content: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type MoodType = 'happy' | 'neutral' | 'sad';

export interface MoodOption {
  icon: string;
  label: string;
}

export interface DiaryState {
  diaries: Diary[];
  loading: boolean;
  error: string | null;
  selectedTags: string[];
}