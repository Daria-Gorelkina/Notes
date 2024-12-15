import React, {useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.jsx";
import Sorted from "./Sorted.jsx";
import Notes from "./Notes.jsx";
import {useDispatch, useSelector} from 'react-redux';


const Main = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { notes, loading, error } = useSelector((state) => state.notes);
    const [filteredNotes, setFilteredNotes] = useState([]); // Отфильтрованные заметки
    const [sortedNotes, setSortedNotes] = useState([]); // Сортированные заметки
    const [sortOptions, setSortOptions] = useState({ dateOrder: 0, tagsOrder: 0 }); // Параметры сортировки
    const [searchQuery, setSearchQuery] = useState('');

    const searchParams = new URLSearchParams(location.search);
    const tagFilter = searchParams.get("tag");

    useEffect(() => {
        // Фильтруем заметки по тегу
        const filtered = tagFilter
            ? notes.filter((note) => note.tags?.includes(tagFilter))
            : [...notes];

        setFilteredNotes(filtered); // Обновляем отфильтрованные заметки
        setSortedNotes(filtered); // Обновляем сортированные заметки
    }, [notes, tagFilter]);

    useEffect(() => {
        // Фильтрация заметок по поисковому запросу
        const searchedNotes = filteredNotes.filter((note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSortedNotes(searchedNotes);
    }, [searchQuery, filteredNotes]);

    const sortNotes = (originalNotes, { dateOrder, tagsOrder }) => {
        let sorted = [...originalNotes];

        // Сортировка по дате
        if (dateOrder === 1) {
            sorted.sort((a, b) => new Date(Number(a.date)) - new Date(Number(b.date))); // По возрастанию даты
        } else if (dateOrder === 2) {
            sorted.sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date))); // По убыванию даты
        }

        // Сортировка по тегам
        if (tagsOrder === 1) {
            sorted.sort((a, b) => b.tags.length - a.tags.length); // По убыванию количества тегов
        } else if (tagsOrder === 2) {
            sorted.sort((a, b) => a.tags.length - b.tags.length); // По возрастанию количества тегов
        }

        return sorted;
    };

    const handleSortToggle = () => {
        // Переключение между 1 (ASC) и 2 (DESC)
        const newDateOrder = sortOptions.dateOrder === 1 ? 2 : 1;
        const updatedOptions = { ...sortOptions, dateOrder: newDateOrder, tagsOrder: 0 }; // Сбросить сортировку по тегам
        setSortOptions(updatedOptions);

        // Сортировка по дате
        setSortedNotes(sortNotes(filteredNotes, updatedOptions));
    };

    const handleSortTags = () => {
        // Переключение между 1 (ASC) и 2 (DESC)
        const newTagsOrder = sortOptions.tagsOrder === 1 ? 2 : 1;
        const updatedOptions = { ...sortOptions, tagsOrder: newTagsOrder, dateOrder: 0 }; // Сбросить сортировку по дате
        setSortOptions(updatedOptions);

        // Сортировка по тегам
        setSortedNotes(sortNotes(filteredNotes, updatedOptions));
    };

    const handleSearch = (query) => {
        setSearchQuery(query); // Обновляем строку поиска
    };

    return (<div className="h-100 container">
            <Header onSearch={handleSearch}/>
            <div className="row">
                <div className="col-xs-12 col-md-2">
                    <Sorted onSortToggle={handleSortToggle} onSortTags={handleSortTags}/>
                </div>
                <div className="col-xs-12 col-md-10">
                    <Notes notes={sortedNotes}/>
                </div>
            </div>
    </div>
    )
};

export default Main;
