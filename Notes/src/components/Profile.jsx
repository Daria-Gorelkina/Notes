import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { useParams } from 'react-router-dom';
import Header from "./Header.jsx";
import axios from "axios";
import { deleteProfile } from '../store/slices/profileSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { login} = useParams();
    const dispatch = useDispatch();
    const { name, lastname, email, loading, error, password} = useSelector((state) => state.profile);
    const [form, setForm] = useState({ name, lastname, email, login, password});
    const [foto, setFoto] = useState('');

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
        dispatch(fetchProfile(login)); // Передаем login в fetchProfile
    }, [dispatch, login]);

    useEffect(() => {
        setForm({ name, lastname, email, login, password});
    }, [name, lastname, email, login, password]);

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
            <Header />
            <div className="row">
                <div className="col-xs-12 col-md-5 d-flex justify-content-center">
                    {loading && <p>Загрузка...</p>}
                    {error && <p>{error}</p>}
                    <div className="row row-cols-1">
                        <div className="col-12 text-center mb-3"><h1>{login}</h1></div>
                        <div className="col-12 text-center "><img src={ foto } alt="mdo" width="300"
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
                        <div className="mb-3 input-container">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" className="form-control_2" id="password" required=""
                                   placeholder="**********" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-custom">Сохранить</button>
                        <button type="button" className="btn btn-custom" onClick={handleDelete}>Удалить профиль</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
