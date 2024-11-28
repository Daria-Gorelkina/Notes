import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: '', lastname: '', login: '', email: '', password: '', passwordRepeat: '', notes: [], foto: ''
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userInfo.password !== userInfo.passwordRepeat) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5137/signup', userInfo);
            if (response && response.data) {
                navigate('/signin')
                console.log(response.data.message);
            } else {
                console.error('No data returned from server');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'email') {
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                [id]: value,
            }));
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                ['foto']: `https://www.gravatar.com/avatar/${CryptoJS.SHA256( value )}?s=200&d=identicon`,
            }));
            console.log(`https://www.gravatar.com/avatar/${CryptoJS.SHA256( value )}?s=200&d=identicon`)
        }
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [id]: value,
        }));
    };

    useEffect(() => {
        document.body.classList.add("bg", "forhome");
        return () => document.body.classList.remove("bg", "forhome");
    }, []);

    return (
        <div className="container h-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col text-center">
                    <form className="p-3 form-container" onSubmit={handleSubmit}>
                        <legend>Заполните форму регистрации</legend>
                        <div className="mb-3 input-container">
                            <input type="text" className="form-control" id="name" required="" placeholder="Ваше имя *" value={userInfo.name} onChange={handleChange}></input>
                                <label htmlFor="name" className="floating-label">Введите ваше имя</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input type="text" className="form-control" id="lastname" required=""
                                   placeholder="Ваша фамилия *" value={userInfo.lastname} onChange={handleChange}></input>
                                <label htmlFor="lastname" className="floating-label">Введите вашу фамилию</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input type="text" className="form-control" id="login" required=""
                                   placeholder="Ваш логин *" value={userInfo.login} onChange={handleChange}></input>
                                <label htmlFor="login" className="floating-label">Введите ваш логин</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input type="email" className="form-control" id="email" required=""
                                   placeholder="Ваш email *" value={userInfo.email} onChange={handleChange}></input>
                                <label htmlFor="email" className="floating-label">Введите ваш email</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input type="password" className="form-control" id="password" required=""
                                   placeholder="Ваш пароль *" value={userInfo.password} onChange={handleChange}></input>
                                <label htmlFor="password" className="floating-label">Придумайте пароль</label>
                        </div>
                        <div className="mb-3 input-container">
                            <input type="password" className="form-control" id="passwordRepeat" required=""
                                   placeholder="Повторите пароль *" value={userInfo.passwordRepeat} onChange={handleChange}></input>
                                <label htmlFor="passwordRepeat" className="floating-label">Повторите пароль</label>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-custom">Зарегистрироваться</button>
                        <p className="mb-0 mt-1">Уже есть аккаунт? <a href="/signin" className="link-dark">Войти</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
