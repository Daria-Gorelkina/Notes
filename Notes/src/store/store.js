import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import notesReducer from './slices/notesSlice';
import modalReducer from './slices/modalSlice';
import editNoteReducer from './slices/editNoteSlice';
import ViewNoteReducer from "./slices/viewmodalSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        notes: notesReducer,
        modal: modalReducer,
        editNote: editNoteReducer,
        viewmodal: ViewNoteReducer,
    },
});

export default store;
