import { createSlice } from '@reduxjs/toolkit';

const editNoteSlice = createSlice({
    name: 'editNote',
    initialState: {
        note: null, // Здесь будет храниться редактируемая заметка
        isEditing: false,
    },
    reducers: {
        setEditNote: (state, action) => {
            state.note = action.payload;
            state.isEditing = true;
        },
        clearEditNote: (state) => {
            state.note = null;
            state.isEditing = false;
            window.location.reload()
        },
    },
});

export const { setEditNote, clearEditNote } = editNoteSlice.actions;

export default editNoteSlice.reducer;
