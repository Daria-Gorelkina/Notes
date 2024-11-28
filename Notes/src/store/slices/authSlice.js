import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        login: '',
        notes: [],
    },
    isAuthenticated: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        loginFailed: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { login, logout, loginFailed} = authSlice.actions;
export default authSlice.reducer;
