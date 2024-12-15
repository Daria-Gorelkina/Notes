import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchNotes, deleteNote } from '../store/slices/notesSlice';
import {openModal, setNewNote} from "../store/slices/modalSlice.js";
import {openModalt} from "../store/slices/tagsSlice.js";
import NoteModal from "./NoteModal.jsx";
import { setEditNote } from '../store/slices/editNoteSlice';
import EditNoteModal from './EditNoteModal';
import ViewNoteModal from './ViewNoteModal';
import { openviewModal } from "../store/slices/viewmodalSlice.js";
import TagsModal from './TagsModal';
import { fetchTags } from '../store/slices/tagsSlice';


const Notes = ({ notes }) => {
    /* const [notes, setNotes] = useState([
                                           { title: 'Note1', description: 'lalala' },
                                           { title: 'Note2', description: 'hahaha' }
                                       ]); */
    const dispatch = useDispatch();
    const { login } = useParams();
    const { loading, error } = useSelector((state) => state.notes);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [currentNoteTags, setCurrentNoteTags] = useState([]);

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

    const handleTagClick = (noteId) => {
        setCurrentNoteId(noteId);
        dispatch(openModalt());
        dispatch(fetchTags({ login, noteId }));
    };


    return (<div className="row">
            {loading && <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor"
                             className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path
                    d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fill-rule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
            </svg>

            }
            {error && <p>{error}</p>}
            {notes.map((note) => (
                <div key={note.id} className="col-xs-12 col-md-4 p-2">
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
                            <hr/>
                            <p style={{ whiteSpace: 'pre-wrap' }} className="note-description">{note.description}</p>
                            <div>
                                {note.tags && note.tags.length > 0 ? (
                                    note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="badge bg-secondary mx-1"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleTagClick(note.id)}
                                        >
                {tag}
            </span>
                                    ))
                                ) : (
                                    <span className="text-muted"></span>
                                )}
                            </div>
                            <button className="btn btn_notes_delete" onClick={() => handleDelete(note.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg></button>
                            <button className="btn btn_notes_update" onClick={() => handleEdit(note)}>
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
                            <button className="btn btn-info btn_notes_tag" onClick={() => handleTagClick(note.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-tag" viewBox="0 0 16 16">
                                    <path
                                        d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                                    <path
                                        d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <button
                className="btn fixed-btn"
                onClick={() => dispatch(openModal())}
            >
                +
            </button>
            <NoteModal />
            <EditNoteModal />
            <ViewNoteModal />
            {currentNoteId && <TagsModal noteId={currentNoteId} />}
        </div>
    )
}

export default Notes;