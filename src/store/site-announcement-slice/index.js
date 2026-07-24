import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { siteAnnouncement as siteAnnouncementDefaults } from "@/config";

const initialState = {
  isLoading: false,
  isSaving: false,
  text: siteAnnouncementDefaults.text,
  isEnabled: true,
};

export const getSiteAnnouncement = createAsyncThunk(
  "siteAnnouncement/getSiteAnnouncement",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/common/announcement`,
    );
    return response.data;
  },
);

export const getAdminSiteAnnouncement = createAsyncThunk(
  "siteAnnouncement/getAdminSiteAnnouncement",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/announcement`,
    );
    return response.data;
  },
);

export const updateSiteAnnouncement = createAsyncThunk(
  "siteAnnouncement/updateSiteAnnouncement",
  async (announcementData) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/admin/announcement`,
      announcementData,
    );
    return response.data;
  },
);

const siteAnnouncementSlice = createSlice({
  name: "siteAnnouncement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSiteAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSiteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.text = action.payload.data.text;
        state.isEnabled = action.payload.data.isEnabled;
      })
      .addCase(getSiteAnnouncement.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAdminSiteAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminSiteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.text = action.payload.data.text;
        state.isEnabled = action.payload.data.isEnabled;
      })
      .addCase(getAdminSiteAnnouncement.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSiteAnnouncement.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateSiteAnnouncement.fulfilled, (state, action) => {
        state.isSaving = false;
        state.text = action.payload.data.text;
        state.isEnabled = action.payload.data.isEnabled;
      })
      .addCase(updateSiteAnnouncement.rejected, (state) => {
        state.isSaving = false;
      });
  },
});

export default siteAnnouncementSlice.reducer;
