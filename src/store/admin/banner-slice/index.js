import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  bannerList: [],
  activeBannerList: [],
};

// Get all banners
export const getAllBanners = createAsyncThunk(
  "banner/getAllBanners",
  async () => {
    const response = await axios.get(`http://localhost:5000/api/admin/banners`);
    return response.data;
  }
);

// Get active banners
export const getActiveBanners = createAsyncThunk(
  "banner/getActiveBanners",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/banners/active`
    );
    return response.data;
  }
);

// Create banner
export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async (bannerData) => {
    const response = await axios.post(
      `http://localhost:5000/api/admin/banners`,
      bannerData
    );
    return response.data;
  }
);

// Update banner
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, bannerData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/banners/${id}`,
      bannerData
    );
    return response.data;
  }
);

// Delete banner
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/banners/${id}`
    );
    return response.data;
  }
);

// Toggle banner status
export const toggleBannerStatus = createAsyncThunk(
  "banner/toggleBannerStatus",
  async (id) => {
    const response = await axios.patch(
      `http://localhost:5000/api/admin/banners/${id}/toggle`
    );
    return response.data;
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all banners
      .addCase(getAllBanners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bannerList = action.payload.data;
      })
      .addCase(getAllBanners.rejected, (state) => {
        state.isLoading = false;
        state.bannerList = [];
      })
      // Get active banners
      .addCase(getActiveBanners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBannerList = action.payload.data;
      })
      .addCase(getActiveBanners.rejected, (state) => {
        state.isLoading = false;
        state.activeBannerList = [];
      })
      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bannerList.push(action.payload.data);
      })
      .addCase(createBanner.rejected, (state) => {
        state.isLoading = false;
      })
      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bannerList.findIndex(
          (banner) => banner._id === action.payload.data._id
        );
        if (index !== -1) {
          state.bannerList[index] = action.payload.data;
        }
      })
      .addCase(updateBanner.rejected, (state) => {
        state.isLoading = false;
      })
      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bannerList = state.bannerList.filter(
          (banner) => banner._id !== action.meta.arg
        );
      })
      .addCase(deleteBanner.rejected, (state) => {
        state.isLoading = false;
      })
      // Toggle banner status
      .addCase(toggleBannerStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleBannerStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bannerList.findIndex(
          (banner) => banner._id === action.payload.data._id
        );
        if (index !== -1) {
          state.bannerList[index] = action.payload.data;
        }
      })
      .addCase(toggleBannerStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default bannerSlice.reducer;
