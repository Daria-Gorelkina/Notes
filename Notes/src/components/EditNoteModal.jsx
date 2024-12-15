import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEditNote } from '../store/slices/editNoteSlice';
import { updateNote } from '../store/slices/notesSlice';
import { useParams } from 'react-router-dom';

const EditNoteModal = () => {
    const dispatch = useDispatch();
    const { login } = useParams();
    const { note, isEditing } = useSelector((state) => state.editNote || {});

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setDescription(note.description || '');
        }
    }, [note]);

    const handleSave = () => {
        if (note && note.id) {
            console.log(note.id)
            const url = `http://localhost:5137/users/${login}/notes/${note.id}`;
            console.log('PUT URL:', url);
            console.log('Payload:', { title, description });
            dispatch(updateNote({ login, note: { id: note.id, title, description } }));
            dispatch(clearEditNote());
        }
    };

    if (!isEditing) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Редактировать заметку</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => dispatch(clearEditNote())}
                        >
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="noteTitle">Заголовок</label>
                            <input
                                type="text"
                                id="noteTitle"
                                className="form-control form-control-edit-note"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="noteDescription">Описание</label>
                            <textarea
                                id="noteDescription"
                                className="form-control form-control-edit-note"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ whiteSpace: 'pre-wrap' }}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => dispatch(clearEditNote())}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleSave}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNoteModal;
