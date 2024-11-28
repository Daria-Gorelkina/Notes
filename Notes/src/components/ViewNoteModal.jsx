import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeviewModal } from '../store/slices/viewmodalSlice.js';
import {closeModal, setNewNote} from "../store/slices/modalSlice.js";

const ViewNoteModal = () => {
    const dispatch = useDispatch();
    const { isOpen, selectedNote } = useSelector((state) => state.viewmodal);

    if (!isOpen || !selectedNote) {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Просмотр заметки</h5>
                    </div>
                    <div className="modal-body">
                        <h3>{selectedNote.title}</h3>
                        {/* Контейнер с ограничением высоты и скроллом */}
                        <div
                            style={{
                                maxHeight: '300px', // Ограничение высоты
                                overflowY: 'auto', // Скролл при переполнении
                                wordWrap: 'break-word', // Перенос длинных слов
                                whiteSpace: 'pre-wrap', // Сохранение пробелов и переносов строк
                            }}
                        >
                            <p style={{ whiteSpace: 'pre-wrap' }} >{selectedNote.description}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={() => dispatch(closeviewModal())}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNoteModal;
