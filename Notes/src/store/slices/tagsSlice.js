    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

    export const fetchTags = createAsyncThunk('tags/fetchTags', async ({ login, noteId }) => {
        const response = await axios.get(`http://localhost:5137/users/${login}/notes/${noteId}/tags`);
        return { noteId, tags: response.data.tags };
    });

    export const addTag = createAsyncThunk('tags/addTag', async ({ login, noteId, tag }) => {
        const response = await axios.post(`http://localhost:5137/users/${login}/notes/${noteId}/tags`, { tag });
        return { noteId, tag: response.data.tag };
    });

    export const deleteTag = createAsyncThunk('tags/deleteTag', async ({ login, noteId, tag }) => {
        await axios.delete(`http://localhost:5137/users/${login}/notes/${noteId}/tags/${tag}`);
        return { noteId, tag };
    });

    const tagsSlice = createSlice({
        name: 'tags',
        initialState: {isModalOpen: false, tag: ''},
        reducers: {
            openModalt: (state) => {
                state.isModalOpen = true;
            },
            closeModalt: (state) => {
                state.isModalOpen = false;
                window.location.reload()
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchTags.fulfilled, (state, action) => {
                    state[action.payload.noteId] = action.payload.tags;
                })
                .addCase(addTag.fulfilled, (state, action) => {
                    state[action.payload.noteId] = [...(state[action.payload.noteId] || []), action.payload.tag];
                })
                .addCase(deleteTag.fulfilled, (state, action) => {
                    state[action.payload.noteId] = (state[action.payload.noteId] || []).filter(tag => tag !== action.payload.tag);
                });
        },
    });
    export const { openModalt, closeModalt } = tagsSlice.actions;
    export default tagsSlice.reducer;
