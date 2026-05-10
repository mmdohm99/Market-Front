import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  brandList: [],
  activeBrandList: [],
};

// Get all brands
export const getAllBrands = createAsyncThunk("brand/getAllBrands", async () => {
  const response = await axios.get(`http://localhost:5000/api/admin/brands`);
  return response.data;
});

// Get active brands
export const getActiveBrands = createAsyncThunk(
  "brand/getActiveBrands",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/brands/active`
    );
    return response.data;
  }
);

// Create brand
export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (brandData) => {
    const response = await axios.post(
      `http://localhost:5000/api/admin/brands`,
      brandData
    );
    return response.data;
  }
);

// Update brand
export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ id, brandData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/brands/${id}`,
      brandData
    );
    return response.data;
  }
);

// Delete brand
export const deleteBrand = createAsyncThunk("brand/deleteBrand", async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/admin/brands/${id}`
  );
  return response.data;
});

// Toggle brand status
export const toggleBrandStatus = createAsyncThunk(
  "brand/toggleBrandStatus",
  async (id) => {
    const response = await axios.patch(
      `http://localhost:5000/api/admin/brands/${id}/toggle`
    );
    return response.data;
  }
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all brands
      .addCase(getAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload.data;
      })
      .addCase(getAllBrands.rejected, (state) => {
        state.isLoading = false;
        state.brandList = [];
      })
      // Get active brands
      .addCase(getActiveBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBrandList = action.payload.data;
      })
      .addCase(getActiveBrands.rejected, (state) => {
        state.isLoading = false;
        state.activeBrandList = [];
      })
      // Create brand
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList.push(action.payload.data);
      })
      .addCase(createBrand.rejected, (state) => {
        state.isLoading = false;
      })
      // Update brand
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.brandList.findIndex(
          (brand) => brand._id === action.payload.data._id
        );
        if (index !== -1) {
          state.brandList[index] = action.payload.data;
        }
      })
      .addCase(updateBrand.rejected, (state) => {
        state.isLoading = false;
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = state.brandList.filter(
          (brand) => brand._id !== action.meta.arg
        );
      })
      .addCase(deleteBrand.rejected, (state) => {
        state.isLoading = false;
      })
      // Toggle brand status
      .addCase(toggleBrandStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleBrandStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.brandList.findIndex(
          (brand) => brand._id === action.payload.data._id
        );
        if (index !== -1) {
          state.brandList[index] = action.payload.data;
        }
      })
      .addCase(toggleBrandStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default brandSlice.reducer;
