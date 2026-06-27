import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || null;
      state.isAuthenticated = true;
      state.authError = null;
    },

    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },

    setAuthError: (state, action) => {
      state.authError = action.payload;
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.authLoading = false;
      state.authError = null;
    },

    clearAuthError: (state) => {
      state.authError = null;
    },
  },
});

export const {
  setCredentials,
  setAuthLoading,
  setAuthError,
  updateUser,
  logoutUser,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
