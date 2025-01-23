// loginSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/users/login', credentials);     
      return response.data; // Assuming response contains user details in token
    } 
    catch (error) {
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

// Function to extract user details from a valid token
const extractUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
    return { name: decoded.name || null, email: decoded.email || null, role: decoded.role || null }; // Extract user info
  } catch (error) {
    return null;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

  // Retrieve token from localStorage if available
const persistedToken = localStorage.getItem('token');

// Check if the token is valid and extract user info
if (persistedToken && isValidToken(persistedToken)) {
  const user = extractUserFromToken(persistedToken);
  initialState.isAuthenticated = true;
  initialState.token = persistedToken;
  initialState.user = user;
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

      // Remove token from localStorage
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = extractUserFromToken(action.payload.token); // Extract user from token
        console.log(state.user)
        state.token = action.payload.token; // Save token globally
        console.log(action.payload.token)
        state.error = null;

        // Save token to localStorage
        localStorage.setItem('token', action.payload.token);
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