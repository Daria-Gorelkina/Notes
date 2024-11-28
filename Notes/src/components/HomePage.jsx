import React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/signin");
    };

    useEffect(() => {
        document.body.classList.add("bg");
        document.body.classList.add("forhome");
        return () => {
            document.body.classList.remove("bg");
            document.body.classList.remove("forhome");
        };
    }, []);

    return (
        <div className="container h-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col text-center home_page">
                    <h1>Заметки</h1>
                    <hr className="mx-auto w-25 hr_weight"></hr>
                    <p>Приложение для ведения заметок</p>
                    <button type="button" className="btn btn-secondary" onClick={handleLoginClick}>
                        Войти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
