import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { diaryDB } from "../database/db";
import { type Diary, type DiaryState } from "../types";

// 非同期アクション
export const fetchDiaries = createAsyncThunk("diary/fetchDiaries", async () => {
  const diaries = await diaryDB.getAll();
  return diaries;
});

export const addDiary = createAsyncThunk(
  "diary/addDiary",
  async (diaryData: Omit<Diary, "id" | "createdAt" | "updatedAt">) => {
    const id = await diaryDB.add(diaryData);
    return { ...diaryData, id } as Diary;
  },
);

export const updateDiary = createAsyncThunk(
  "diary/updateDiary",
  async ({ id, data }: { id: string; data: Partial<Diary> }) => {
    await diaryDB.update(id, data);
    return { id, data };
  },
);

export const deleteDiary = createAsyncThunk(
  "diary/deleteDiary",
  async (id: string) => {
    await diaryDB.delete(id);
    return id;
  },
);

const initialState: DiaryState = {
  diaries: [],
  loading: false,
  error: null,
  selectedTag: "ALL",
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch diaries
      .addCase(fetchDiaries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.diaries = action.payload;
      })
      .addCase(fetchDiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch diaries";
      })
      // Add diary
      .addCase(addDiary.fulfilled, (state, action) => {
        state.diaries.unshift(action.payload);
      })
      // Update diary
      .addCase(updateDiary.fulfilled, (state, action) => {
        const index = state.diaries.findIndex(
          (d) => d.id === action.payload.id,
        );
        if (index !== -1) {
          state.diaries[index] = {
            ...state.diaries[index],
            ...action.payload.data,
          };
        }
      })
      // Delete diary
      .addCase(deleteDiary.fulfilled, (state, action) => {
        state.diaries = state.diaries.filter((d) => d.id !== action.payload);
      });
  },
});

export const { setSelectedTag } = diarySlice.actions;
export default diarySlice.reducer;
