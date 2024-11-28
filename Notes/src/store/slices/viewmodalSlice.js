import { createSlice } from '@reduxjs/toolkit';

const viewmodalSlice = createSlice({
    name: 'viewmodal',
    initialState: {
        isOpen: false,
        selectedNote: null,
    },
    reducers: {
        openviewModal(state, action) {
            state.isOpen = true;
            state.selectedNote = action.payload; // Заметка для отображения
        },
        closeviewModal(state) {
            state.isOpen = false;
            state.selectedNote = null;
        },
    },
});

export const { openviewModal, closeviewModal } = viewmodalSlice.actions;

export default viewmodalSlice.reducer;
