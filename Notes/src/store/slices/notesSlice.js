import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;

export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async (login, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5137/users/${login}/notes`);
            const notesWithTags = await Promise.all(response.data.notes.map(async (note) => {
                const tagsResponse = await axios.get(`http://localhost:5137/users/${login}/notes/${note.id}/tags`);
                return { ...note, tags: tagsResponse.data.tags };
            }));
            return notesWithTags;
        } catch (error) {
            window.location.href = '/';
        }
    }
);

export const addNote = createAsyncThunk(
    'notes/addNote',
    async ({ login, note }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5137/users/${login}/notes`, note);
            return response.data.note;
        } catch (error) {
            return rejectWithValue('Не удалось добавить заметку');
        }
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async ({ login, noteId }, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5137/users/${login}/notes/${noteId}`);
            return noteId;
        } catch (error) {
            return rejectWithValue('Не удалось удалить заметку');
        }
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ login, note }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5137/users/${login}/notes/${note.id}`, note);
            return response.data.note;
        } catch (error) {
            console.log(error)
            return rejectWithValue('Не удалось обновить заметку');
        }
    }
);

const initialState = {
    notes: [],
    loading: false,
    error: null,
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Notes
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Note
            .addCase(addNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })
            // Delete Note
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter((note) => note.id !== action.payload);
            })
            // Update Note
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.notes.findIndex((n) => n.id === action.payload.id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            });
    },
});

export default notesSlice.reducer;
