import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/common/feature";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(`${BASE}/get`);
    return response.data;
  },
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(`${BASE}/add`, { image });
    return response.data;
  },
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(`${BASE}/delete/${id}`);
    return response.data;
  },
);

export const reorderFeatureImages = createAsyncThunk(
  "/order/reorderFeatureImages",
  async (ids) => {
    const response = await axios.put(`${BASE}/reorder`, { ids });
    return response.data;
  },
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── getFeatureImages ──────────────────────────────
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      // ── addFeatureImage ───────────────────────────────
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatureImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false;
      })

      // ── deleteFeatureImage ────────────────────────────
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optimistically remove from local list using the id echoed back
        const deletedId = action.payload?.data?._id;
        if (deletedId) {
          state.featureImageList = state.featureImageList.filter(
            (img) => img._id !== deletedId,
          );
        }
      })
      .addCase(deleteFeatureImage.rejected, (state) => {
        state.isLoading = false;
      })

      // ── reorderFeatureImages ──────────────────────────
      .addCase(reorderFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reorderFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        // If the backend returns the sorted list, sync it directly
        if (action.payload?.data) {
          state.featureImageList = action.payload.data;
        }
      })
      .addCase(reorderFeatureImages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;
