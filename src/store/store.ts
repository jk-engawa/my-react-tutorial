import { configureStore } from "@reduxjs/toolkit";
import diaryReducer from "./diarySlice";

export const store = configureStore({
  reducer: {
    diary: diaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Dexieのプロミスや日付オブジェクトを無視
        ignoredActions: [
          "diary/fetchDiaries/fulfilled",
          "diary/addDiary/fulfilled",
        ],
        ignoredPaths: ["diary.diaries"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
