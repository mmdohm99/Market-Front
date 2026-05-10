import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  palette: null,
};

export const getThemePalette = createAsyncThunk(
  "theme/getThemePalette",
  async () => {
    const response = await axios.get("http://localhost:5000/api/common/theme");
    return response.data;
  }
);

export const saveThemePalette = createAsyncThunk(
  "theme/saveThemePalette",
  async (palette) => {
    const response = await axios.put(
      "http://localhost:5000/api/admin/theme",
      palette
    );
    return response.data;
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getThemePalette.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getThemePalette.fulfilled, (state, action) => {
        state.isLoading = false;
        state.palette = action.payload.data;
      })
      .addCase(getThemePalette.rejected, (state) => {
        state.isLoading = false;
        state.palette = null;
      })
      .addCase(saveThemePalette.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveThemePalette.fulfilled, (state, action) => {
        state.isLoading = false;
        state.palette = action.payload.data;
      })
      .addCase(saveThemePalette.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default themeSlice.reducer;
