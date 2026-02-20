import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  loading: boolean;
  hiddenOverflow: boolean;
}

const initialState: LoadingState = { loading: true, hiddenOverflow: true },
  LoadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
      isLoading: (state) => {
        state.loading = true;
      },
      isHiddenOverflow: (state) => {
        state.hiddenOverflow = true;
      },
      isLoaded: (state) => {
        state.loading = false;
      },
      isVisibleOverflow: (state) => {
        state.hiddenOverflow = false;
      },
    },
  });

export const { isLoading, isLoaded, isHiddenOverflow, isVisibleOverflow } =
  LoadingSlice.actions;
export default LoadingSlice.reducer;
