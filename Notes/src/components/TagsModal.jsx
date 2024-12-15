import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTag, deleteTag, fetchTags, closeModalt } from '../store/slices/tagsSlice';
import {useParams} from "react-router-dom";

const TagsModal = ({ noteId }) => {
    const dispatch = useDispatch();
    const { login } = useParams();
    const tags = useSelector((state) => state.tags[noteId] || []);
    const { isModalOpen } = useSelector(state => state.tags);
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim()) {
            dispatch(addTag({ login, noteId, tag: newTag.trim() }));
            setNewTag('');
        }
    };

    const handleDeleteTag = (tag) => {
        dispatch(deleteTag({ login, noteId, tag }));
    };

    if (!isModalOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Управление тегами</h5>
                        <button type="button" className="close" onClick={() => dispatch(closeModalt())}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {tags.map((tag) => (
                                <li key={tag} className="list-group-item d-flex justify-content-between align-items-center">
                                    {tag}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTag(tag)}>
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="input-group mt-3">
                            <input
                                type="text"
                                className="form-control"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Новый тег"
                            />
                            <button className="btn btn-primary btn-sm" onClick={handleAddTag}>
                                Добавить
                            </button>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => dispatch(closeModalt())}>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagsModal;
