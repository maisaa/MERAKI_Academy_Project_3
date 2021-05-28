import React from 'react';
import './Navigation.css';
// import { Register } from '../register/Register';
// import { Login } from '../login/Login';
import { Link } from 'react-router-dom';


export const Navigation = () => {
    return (
        
        <div className="Nav">
            <Link to="/dashboard"> dashboard </Link>
            <Link to="/login"> Login </Link>
            <Link to="/Register"> Register </Link>
        </div>
    )
}