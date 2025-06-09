import { type MoodLevel, type MoodOption } from "../types";

// 5段階の気持ちを表すアイコンの定義
export const MOODS: Record<MoodLevel, MoodOption> = {
  1: {
    icon: "😭",
    label: "とても悪い",
    details: ["最悪", "つらい", "しんどい", "イライラ", "がっかり"],
  },
  2: {
    icon: "😔",
    label: "悪い",
    details: ["だるい", "疲れた", "不安", "もやもや", "さみしい"],
  },
  3: {
    icon: "😐",
    label: "ふつう",
    details: ["まあまあ", "ぼちぼち", "普通", "いつも通り", "なんとなく"],
  },
  4: {
    icon: "😊",
    label: "良い",
    details: ["楽しい", "うれしい", "ほっとした", "ワクワク", "充実"],
  },
  5: {
    icon: "🤩",
    label: "とても良い",
    details: ["最高", "感激", "幸せ", "やったー", "絶好調"],
  },
};

// サンプルタグ
export const SAMPLE_TAGS: string[] = [
  "ALL",
  "仕事",
  "家族",
  "趣味",
  "健康",
  "勉強",
];

// スライダーのマーク
export const MOOD_MARKS = [
  { value: 1, label: "" },
  { value: 2, label: "" },
  { value: 3, label: "" },
  { value: 4, label: "" },
  { value: 5, label: "" },
];
