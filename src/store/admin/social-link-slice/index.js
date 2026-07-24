import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  socialLinkList: [],
  activeSocialLinkList: [],
};

export const getAllSocialLinks = createAsyncThunk(
  "socialLink/getAllSocialLinks",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/social-links`,
    );
    return response.data;
  },
);

export const getActiveSocialLinks = createAsyncThunk(
  "socialLink/getActiveSocialLinks",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/common/social-links`,
    );
    return response.data;
  },
);

export const createSocialLink = createAsyncThunk(
  "socialLink/createSocialLink",
  async (socialLinkData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/social-links`,
      socialLinkData,
    );
    return response.data;
  },
);

export const updateSocialLink = createAsyncThunk(
  "socialLink/updateSocialLink",
  async ({ id, socialLinkData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/admin/social-links/${id}`,
      socialLinkData,
    );
    return response.data;
  },
);

export const deleteSocialLink = createAsyncThunk(
  "socialLink/deleteSocialLink",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/admin/social-links/${id}`,
    );
    return response.data;
  },
);

export const toggleSocialLinkStatus = createAsyncThunk(
  "socialLink/toggleSocialLinkStatus",
  async (id) => {
    const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/social-links/${id}/toggle`,
    );
    return response.data;
  },
);

const socialLinkSlice = createSlice({
  name: "socialLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSocialLinks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSocialLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.socialLinkList = action.payload.data;
      })
      .addCase(getAllSocialLinks.rejected, (state) => {
        state.isLoading = false;
        state.socialLinkList = [];
      })
      .addCase(getActiveSocialLinks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveSocialLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSocialLinkList = action.payload.data;
      })
      .addCase(getActiveSocialLinks.rejected, (state) => {
        state.isLoading = false;
        state.activeSocialLinkList = [];
      })
      .addCase(createSocialLink.fulfilled, (state, action) => {
        state.socialLinkList.push(action.payload.data);
      })
      .addCase(updateSocialLink.fulfilled, (state, action) => {
        const index = state.socialLinkList.findIndex(
          (link) => link._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.socialLinkList[index] = action.payload.data;
        }
      })
      .addCase(deleteSocialLink.fulfilled, (state, action) => {
        state.socialLinkList = state.socialLinkList.filter(
          (link) => link._id !== action.payload.data._id,
        );
      })
      .addCase(toggleSocialLinkStatus.fulfilled, (state, action) => {
        const index = state.socialLinkList.findIndex(
          (link) => link._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.socialLinkList[index] = action.payload.data;
        }
      });
  },
});

export default socialLinkSlice.reducer;
