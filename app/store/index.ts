import { configureStore } from "@reduxjs/toolkit";
import languageSlice from "./slices/language";
import loadingSlice from "./slices/loading";

export const store = configureStore({
  reducer: {
    language: languageSlice,
    loading: loadingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
