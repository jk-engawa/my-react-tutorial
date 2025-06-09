import Dexie, { type Table } from "dexie";
import { type Diary } from "../types";

// Dexieの拡張クラス
class DiaryDatabase extends Dexie {
  diaries!: Table<Diary>;

  constructor() {
    super("DiaryDatabase");
    this.version(1).stores({
      diaries: "id, date, mood, tags, content, photos, createdAt, updatedAt",
    });
  }
}

export const db = new DiaryDatabase();

// データベース操作のヘルパー関数
export const diaryDB = {
  // 全ての日記を取得
  async getAll(): Promise<Diary[]> {
    return await db.diaries.orderBy("date").reverse().toArray();
  },

  // 特定の日記を取得
  async getById(id: string): Promise<Diary | undefined> {
    return await db.diaries.get(id);
  },

  // 日記を追加（既にIDは設定されている前提）
  async add(diary: Diary): Promise<void> {
    const now = new Date().toISOString();
    await db.diaries.add({
      ...diary,
      createdAt: now,
      updatedAt: now,
    });
  },

  // 日記を更新
  async update(id: string, diary: Partial<Diary>): Promise<void> {
    await db.diaries.update(id, {
      ...diary,
      updatedAt: new Date().toISOString(),
    });
  },

  // 日記を削除
  async delete(id: string): Promise<void> {
    await db.diaries.delete(id);
  },
};
