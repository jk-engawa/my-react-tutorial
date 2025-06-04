import Dexie, { type Table } from 'dexie';
import { type Diary } from '../types';

// Dexieの拡張クラス
class DiaryDatabase extends Dexie {
  diaries!: Table<Diary>;

  constructor() {
    super('DiaryDatabase');
    this.version(1).stores({
      diaries: '++id, date, mood, tags, content, photos, createdAt, updatedAt'
    });
  }
}

export const db = new DiaryDatabase();

// データベース操作のヘルパー関数
export const diaryDB = {
  // 全ての日記を取得
  async getAll(): Promise<Diary[]> {
    return await db.diaries.orderBy('date').reverse().toArray();
  },

  // 特定の日記を取得
  async getById(id: number): Promise<Diary | undefined> {
    return await db.diaries.get(id);
  },

  // 日記を追加
  async add(diary: Omit<Diary, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    return await db.diaries.add({
      ...diary,
      createdAt: now,
      updatedAt: now
    }) as number;
  },

  // 日記を更新
  async update(id: number, diary: Partial<Diary>): Promise<number> {
    return await db.diaries.update(id, {
      ...diary,
      updatedAt: new Date().toISOString()
    });
  },

  // 日記を削除
  async delete(id: number): Promise<void> {
    return await db.diaries.delete(id);
  }
};