import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalOpen: false,
    newNote: {
        title: '',
        description: '',
        tags: [],
        id: null
    }
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.newNote = { title: '', description: '', tags: [], id: null };
        },
        setNewNote: (state, action) => {
            state.newNote = action.payload;
        },
        resetNewNote: (state) => {
            state.newNote = { title: '', description: '',tags: [], id: null };
        }
    }
});

export const { openModal, closeModal, setNewNote, resetNewNote } = modalSlice.actions;
export default modalSlice.reducer;
