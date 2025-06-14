import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "./createAppSlice"
import { diaryDB } from "../database/db"
import { type Diary, type DiaryState } from "../types"

const initialState: DiaryState = {
  diaries: [],
  loading: false,
  error: null,
  selectedTag: "ALL",
}

// Using the new createAppSlice with integrated async thunk support
export const diarySlice = createAppSlice({
  name: "diary",
  initialState,
  reducers: create => ({
    // 同期的なreducers
    setSelectedTag: create.reducer((state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload
    }),
    
    // 非同期アクション - fetchDiaries
    fetchDiaries: create.asyncThunk(
      async () => {
        const diaries = await diaryDB.getAll()
        return diaries
      },
      {
        pending: (state) => {
          state.loading = true
          state.error = null
        },
        fulfilled: (state, action) => {
          state.loading = false
          state.diaries = action.payload
        },
        rejected: (state, action) => {
          state.loading = false
          state.error = action.error.message || "Failed to fetch diaries"
        },
      }
    ),
    
    // 非同期アクション - addDiary
    addDiary: create.asyncThunk(
      async (diaryData: Diary) => {
        await diaryDB.add(diaryData)
        return diaryData
      },
      {
        fulfilled: (state, action) => {
          state.diaries.unshift(action.payload)
        },
      }
    ),
    
    // 非同期アクション - updateDiary
    updateDiary: create.asyncThunk(
      async ({ id, data }: { id: string; data: Partial<Diary> }) => {
        await diaryDB.update(id, data)
        return { id, data }
      },
      {
        fulfilled: (state, action) => {
        const index = state.diaries.findIndex(
            (d) => d.id === action.payload.id
          )
        if (index !== -1) {
          state.diaries[index] = {
            ...state.diaries[index],
            ...action.payload.data,
            }
        }
        },
      }
    ),
    
    // 非同期アクション - deleteDiary
    deleteDiary: create.asyncThunk(
      async (id: string) => {
        await diaryDB.delete(id)
        return id
      },
      {
        fulfilled: (state, action) => {
          state.diaries = state.diaries.filter((d) => d.id !== action.payload)
        },
      }
    ),
  }),
  
  // セレクターの定義
  selectors: {
    selectAllDiaries: (diary) => diary.diaries,
    selectDiaryById: (diary, id: string) => 
      diary.diaries.find(d => d.id === id),
    selectDiariesByTag: (diary) => {
      if (diary.selectedTag === "ALL") {
        return diary.diaries
      }
      return diary.diaries.filter(d => d.tags?.includes(diary.selectedTag))
    },
    selectSelectedTag: (diary) => diary.selectedTag,
    selectIsLoading: (diary) => diary.loading,
    selectError: (diary) => diary.error,
  },
})

// Action creators are generated for each case reducer function.
export const {
  setSelectedTag,
  fetchDiaries,
  addDiary,
  updateDiary,
  deleteDiary,
} = diarySlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectAllDiaries,
  selectDiaryById,
  selectDiariesByTag,
  selectSelectedTag,
  selectIsLoading,
  selectError,
} = diarySlice.selectors