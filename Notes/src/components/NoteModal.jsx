import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {closeModal, resetNewNote, setNewNote} from '../store/slices/modalSlice';
import { addNote, updateNote } from '../store/slices/notesSlice';
import { useParams } from 'react-router-dom';



const NoteModal = () => {
    const { login } = useParams();
    const dispatch = useDispatch();
    const { isModalOpen, newNote } = useSelector(state => state.modal);
    const [title, setTitle] = useState(newNote.title);
    const [description, setDescription] = useState(newNote.description);


    useEffect(() => {
        // Сбрасываем значения полей, если модальное окно открыто
        if (isModalOpen) {
            console.log('New Note in Modal:', newNote);
            setTitle(newNote.title || '');
            setDescription(newNote.description || '');
        }
    }, [isModalOpen, newNote]);

    const handleSubmit = () => {
        dispatch(addNote({ login, note: { title, description } }));
        setTitle('');
        setDescription('');
        dispatch(resetNewNote());
        dispatch(closeModal());
    };




    if (!isModalOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Добавить заметку</h5>
                        <button type="button" className="close" onClick={() => dispatch(closeModal())}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="noteTitle">Заголовок</label>
                            <input
                                type="text"
                                id="noteTitle"
                                className="form-control"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    dispatch(setNewNote({ title: e.target.value, description }));
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="noteDescription">Текст</label>
                            <textarea
                                id="noteDescription"
                                className="form-control"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    dispatch(setNewNote({ title, description: e.target.value }));
                                }}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">

                                    <button type="button" className="btn btn-secondary m-2" onClick={() => dispatch(closeModal())}>
                                        Закрыть
                                    </button>
                                    <button type="button" className="btn btn-primary m-2" onClick={handleSubmit}>
                                        Добавить
                                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;