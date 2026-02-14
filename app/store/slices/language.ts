import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type Locale,
} from "~/constants";

interface LanguageState {
  locale: Locale;
  direction: "rtl" | "ltr";
}

const initialState: LanguageState = {
  locale: DEFAULT_LANGUAGE,
  direction: SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].direction,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, { payload }: { payload: Locale }) => {
      state.locale = payload;
      state.direction = SUPPORTED_LANGUAGES[payload].direction;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
