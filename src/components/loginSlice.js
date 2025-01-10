// loginSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/users/login', credentials);
      return response.data; // Assuming response contains user details and token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Function to validate the token (e.g., decode it or check expiration)
const isValidToken = (token) => {
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
    const expiration = decoded.exp * 1000; // Convert expiration to milliseconds
    return expiration > Date.now(); // Check if token is still valid
  } catch (error) {
    return false;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

// Retrieve token and user from localStorage if available
const persistedToken = localStorage.getItem('token');
const persistedUser = localStorage.getItem('user');

// Check if the token is valid
if (persistedToken && persistedUser && isValidToken(persistedToken)) {
  initialState.isAuthenticated = true;
  initialState.token = persistedToken;
  initialState.user = JSON.parse(persistedUser);
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;

      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user; // Assuming action.payload contains user object
        state.token = action.payload.token; // Save token globally
        state.error = null;

        // Save token and user to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload; // Use the error message from the rejected action
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;