import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (login, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5137/profile/${login}`); // Измените на ваш маршрут
            return response.data; // Предполагается, что API возвращает объект профиля
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить профиль');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async ({login, profileData}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5137/profile/${login}`, profileData); // Измените на ваш маршрут
            return response.data; // Предполагается, что API возвращает обновленный объект профиля
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось обновить профиль');
        }
    }
);


export const deleteProfile = createAsyncThunk(
    'profile/deleteProfile',
    async (login, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:5137/profile/${login}`);
            return response.data; // Возвращает успешное сообщение
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось удалить профиль');
        }
    }
);

const initialState = {
    name: '',
    lastname: '',
    email: '',
    login: '',
    password: '',
    foto: '',
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.name = action.payload.name;
                state.lastname = action.payload.lastname;
                state.email = action.payload.email;
                state.login = action.payload.login;
                state.password = action.payload.password;
                state.foto = action.payload.foto;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.name = action.payload.name;
                state.lastname = action.payload.lastname;
                state.email = action.payload.email;
                state.login = action.payload.login;
                state.password = action.payload.password;
                state.foto = action.payload.foto;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Логика удаления
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProfile.fulfilled, (state) => {
                state.loading = false;
                // Можно добавить очистку состояния, если требуется
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;