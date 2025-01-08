import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for login
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:5000/users/login', credentials);
    return response.data; // Assuming response contains user details and token
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user; // Assuming action.payload contains user object
        state.token = action.payload.token; // Save token globally
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload; // Use the error message from the rejected action
      });
  },
});

export const { logout } = loginSlice.actions; // Export the logout action
export default loginSlice.reducer;