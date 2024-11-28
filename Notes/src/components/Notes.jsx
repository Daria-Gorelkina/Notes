import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchNotes, deleteNote } from '../store/slices/notesSlice';
import {openModal, setNewNote} from "../store/slices/modalSlice.js";
import NoteModal from "./NoteModal.jsx";
import { setEditNote } from '../store/slices/editNoteSlice';
import EditNoteModal from './EditNoteModal';
import ViewNoteModal from './ViewNoteModal';
import { openviewModal } from "../store/slices/viewmodalSlice.js";

const Notes = () => {
    /* const [notes, setNotes] = useState([
                                           { title: 'Note1', description: 'lalala' },
                                           { title: 'Note2', description: 'hahaha' }
                                       ]); */
    const dispatch = useDispatch();
    const { login } = useParams();
    const { notes, loading, error } = useSelector((state) => state.notes);

    useEffect(() => {
        dispatch(fetchNotes( login ));
    }, [dispatch, login]);

    const handleDelete = (noteId) => {
        dispatch(deleteNote({ login, noteId }));
    };

    const handleEdit = (note) => {
        dispatch(setEditNote(note));
    };

    const handleView = (note) => {
        dispatch(openviewModal(note));
    };

    return (<div className="row">
            {loading && <p>Загрузка...</p>}
            {error && <p>{error}</p>}
            {notes.map((note, idx) => (
                <div key={idx} className="col-xs-12 col-md-4 p-2">
                    <div className="row notes m-2">
                        <div className="col-2">
                            <div className="row row-cols-1  py-5">
                                <div className="col">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    </svg>
                                </div>
                                <div className="col">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    </svg>
                                </div>
                                <div className="col">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <h3>{note.title}</h3>
                            <p style={{ whiteSpace: 'pre-wrap' }} className="note-description">{note.description}</p>
                            <button className="btn btn-danger btn_notes_delete" onClick={() => handleDelete(note.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg></button>
                            <button className="btn btn-warning btn_notes_update" onClick={() => handleEdit(note)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path
                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                            <button className="btn btn-info btn_notes_view" onClick={() => handleView(note)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-eye" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                    <path
                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <button
                className="btn btn-primary fixed-btn"
                onClick={() => dispatch(openModal())}
            >
                +
            </button>
            <NoteModal />
            <EditNoteModal />
            <ViewNoteModal />
        </div>
    )
}

export default Notes;