import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { login, loginFailed } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state) => state.auth.error);
    const [credentials, setCredentials] = useState({ login: '', password: '' });

    useEffect(() => {
        document.body.classList.add("bg", "forhome");
        return () => document.body.classList.remove("bg", "forhome");
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5137/signin', credentials);

            // Проверка, что данные содержат пользователя
            if (response.data && response.data.user) {
                dispatch(login({ username: response.data.user.login }));
                navigate(`/main/${response.data.user.login}`);
                console.log(response.data, response.data.user)
            } else {
                throw new Error('Неверный ответ сервера');
            }
        } catch (err) {
            // Если сервер не вернул данные, проверяем ошибку
            const errorMessage = err.response?.data?.message || 'Ошибка входа';
            dispatch(loginFailed(errorMessage));
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    return (
        <div className="container h-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col text-center">
                    <form className="p-3 form-container" onSubmit={handleLoginSubmit}>
                        <legend>Заполните форму</legend>
                        <div className="mb-3 input-container">
                            <input
                                type="text"
                                className="form-control"
                                id="login"
                                required
                                placeholder="Ваш логин *"
                                value={credentials.login}
                                onChange={handleChange}
                            />
                            <label htmlFor="login" className="floating-label">Введите ваш логин</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                required
                                placeholder="Ваш пароль *"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                            <label htmlFor="password" className="floating-label">Введите ваш пароль</label>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-custom">Войти</button>
                        <p className="mb-0 mt-1">Еще нет аккаунта? <a href="/signup" className="link-dark">Зарегистрироваться</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
