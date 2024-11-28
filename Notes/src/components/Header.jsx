import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "axios";

const Header = () => {
    const { login} = useParams();
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


    return (
        <header className="p-3 mb-3 border-bottom">
            {console.log({foto})}
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <p className="m-0 h1 px-3">NOTES</p>
                    </a>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><a href={`/main/${login}`} className="nav-link px-2 link-secondary">Все заметки</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Теги</a></li>
                    </ul>

                    <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 text-center">
                        <input className="search" type="search" placeholder="Search..." aria-label="Search" />
                    </form>

                    <div className="dropdown text-end">
                        <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle"
                           id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={ foto } alt="mdo" width="32" height="32"
                                 className="rounded-circle" />
                        </a>
                        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser">
                            <li className="dropdown-item h3">{login}</li>
                            <li><a className="dropdown-item" href={`/profile/${login}`}>Профиль</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="/signin">Выйти</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
