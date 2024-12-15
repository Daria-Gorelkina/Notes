import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { useParams } from 'react-router-dom';
import Header2 from "./Header2.jsx";
import axios from "axios";
import { deleteProfile } from '../store/slices/profileSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { login} = useParams();
    const dispatch = useDispatch();
    const { name, lastname, email, loading, error} = useSelector((state) => state.profile);
    const [form, setForm] = useState({ name, lastname, email, login});
    const [foto, setFoto] = useState('')

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5137/profile/${login}`);
                setFoto(response.data.foto);
                console.log(response.data.foto)// Предполагается, что API возвращает поле foto
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [login]);

    useEffect(() => {
        document.documentElement.classList.add("for_profile");
        return () => {
            document.documentElement.classList.remove("for_profile");
        };
    }, []);


    useEffect(() => {
        dispatch(fetchProfile(login)); // Передаем login в fetchProfile
    }, [dispatch, login]);

    useEffect(() => {
        setForm({ name, lastname, email, login});
    }, [name, lastname, email, login]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile({ login, profileData: form })); // Передаем login и данные профиля
    };
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await dispatch(deleteProfile(login)).unwrap(); // Убедимся, что удаление завершено
            navigate('/'); // Редирект на главную страницу
        } catch (error) {
            console.error('Ошибка удаления профиля:', error);
        }
    };


    return (
        <div className="container h-100">
            <Header2 />
            {loading && <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor"
                             className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path
                    d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                <path fill-rule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
            </svg>

            }
            <div className="row">
                <div className="col-xs-12 col-md-5 d-flex justify-content-center">
                    {error && <p>{error}</p>}
                    <div className="row row-cols-1 avatar_login">
                        <div className="col-12 text-center mb-3"><h1>{login}</h1></div>
                        <div className="col-12 text-center mb-3"><img src={ foto } alt="mdo" width="300"
                                                                  height="300" className="rounded-circle"></img></div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 input-container">
                            <label htmlFor="name">Имя</label>
                            <input type="text" className="form-control_2" id="name" required=""
                                   placeholder="Имя пользователя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="mb-3 input-container">
                            <label htmlFor="lastname">Фамилия</label>
                            <input type="text" className="form-control_2" id="lastname" required=""
                                   placeholder="Фамилия пользователя" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
                        </div>
                        <div className="mb-3 input-container">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control_2" id="email" required=""
                                   placeholder="Email пользователя" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-custom">Сохранить</button>
                        <button type="button" className="btn btn-custom mx-3" onClick={handleDelete}>Удалить профиль</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
