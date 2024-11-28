import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.jsx";
import Sorted from "./Sorted.jsx";
import Notes from "./Notes.jsx";
import { useDispatch } from 'react-redux';


const Main = () => {
    const dispatch = useDispatch();

    return (<div className="h-100 container">
            <Header />
            <div className="row">
                <div className="col-xs-12 col-md-2">
                    <Sorted />
                </div>
                <div className="col-xs-12 col-md-10">
                    <Notes />
                </div>
            </div>
    </div>
    )
};

export default Main;
