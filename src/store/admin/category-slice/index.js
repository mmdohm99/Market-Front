import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categoryList: [],
  activeCategoryList: [],
};

// Get all categories
export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/categories`
    );
    return response.data;
  }
);

// Get active categories
export const getActiveCategories = createAsyncThunk(
  "category/getActiveCategories",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/categories/active`
    );
    return response.data;
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData) => {
    const response = await axios.post(
      `http://localhost:5000/api/admin/categories`,
      categoryData
    );
    return response.data;
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/categories/${id}`,
      categoryData
    );
    return response.data;
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/categories/${id}`
    );
    return response.data;
  }
);

// Toggle category status
export const toggleCategoryStatus = createAsyncThunk(
  "category/toggleCategoryStatus",
  async (id) => {
    const response = await axios.patch(
      `http://localhost:5000/api/admin/categories/${id}/toggle`
    );
    return response.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.categoryList = [];
      })
      // Get active categories
      .addCase(getActiveCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeCategoryList = action.payload.data;
      })
      .addCase(getActiveCategories.rejected, (state) => {
        state.isLoading = false;
        state.activeCategoryList = [];
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList.push(action.payload.data);
      })
      .addCase(createCategory.rejected, (state) => {
        state.isLoading = false;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categoryList.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.categoryList[index] = action.payload.data;
        }
      })
      .addCase(updateCategory.rejected, (state) => {
        state.isLoading = false;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = state.categoryList.filter(
          (category) => category._id !== action.meta.arg
        );
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.isLoading = false;
      })
      // Toggle category status
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categoryList.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.categoryList[index] = action.payload.data;
        }
      })
      .addCase(toggleCategoryStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default categorySlice.reducer;
