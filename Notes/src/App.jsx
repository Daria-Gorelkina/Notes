import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from './components/HomePage.jsx';
import Main from './components/Main.jsx';
import Profile from './components/Profile.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/main/:login" element={<Main />} />
            <Route path="/profile/:login" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    </Router>
);

export default App;

