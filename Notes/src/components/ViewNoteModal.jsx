import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeviewModal } from '../store/slices/viewmodalSlice.js';
import {closeModal, setNewNote} from "../store/slices/modalSlice.js";
import {closeModalt} from "../store/slices/tagsSlice.js";

const ViewNoteModal = () => {
    const dispatch = useDispatch();
    const { isOpen, selectedNote } = useSelector((state) => state.viewmodal);

    if (!isOpen || !selectedNote) {
        return null;
    }
    const date = new Date(Number(selectedNote.date)); // Получаем текущую дату

    const hours = String(date.getHours()).padStart(2, '0'); // Получаем часы и добавляем ведущий ноль
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0'); // Получаем день и добавляем ведущий ноль
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Получаем месяц (0-11) и добавляем 1, а также ведущий ноль
    const year = date.getFullYear(); // Получаем год

    const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Просмотр заметки</h5>
                        <button type="button" className="close" onClick={() => dispatch(closeviewModal())}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h3>{selectedNote.title}</h3>
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
                        <p>{ formattedDate }</p>
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
