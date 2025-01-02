// loginSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
    const response = await axios.post('http://localhost:5000/users/login', credentials);
    return response.data;
});

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.error.message;
            });
    },
});

export default loginSlice.reducer;