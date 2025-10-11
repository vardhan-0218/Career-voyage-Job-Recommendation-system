// redux/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

// ✅ Async thunk to fetch all admin jobs
export const fetchAllAdminJobs = createAsyncThunk(
  "job/fetchAllAdminJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
        withCredentials: true,
      });
      if (res.data.success) {
        return res.data.jobs;
      } else {
        return rejectWithValue(res.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    loading: false,
    error: null,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdminJobs.fulfilled, (state, action) => {
        state.allAdminJobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
} = jobSlice.actions;

export default jobSlice.reducer;
