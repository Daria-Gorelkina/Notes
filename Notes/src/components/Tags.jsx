import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchNotes } from "../store/slices/notesSlice";
import Header2 from "./Header2.jsx";

const Tags = () => {
    const { login } = useParams();
    const dispatch = useDispatch();
    const { notes, loading, error } = useSelector((state) => state.notes);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchNotes(login));
    }, [dispatch, login]);

    useEffect(() => {
        // Извлечение всех уникальных тегов из заметок
        const allTags = notes.flatMap((note) => note.tags || []);
        const uniqueTags = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
        console.log(uniqueTags)
        setTags(uniqueTags);
    }, [notes]);

    const handleTagClick = (tag) => {
        navigate(`/main/${login}?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="container h-100">
            <Header2 />
            <h3 className="mt-3">Все теги</h3>
            {loading && <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor"
                             className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path
                    d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fill-rule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
            </svg>

            }
            <ul className="list-group">
                {tags.map((tag) => (
                    <li
                        key={tag}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tags;
