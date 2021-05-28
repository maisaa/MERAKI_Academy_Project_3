import React from 'react';
import './Navigation.css';
// import { Register } from '../register/Register';
// import { Login } from '../login/Login';
import { Link, useHistory } from 'react-router-dom';



export const Navigation = ({token}) => {
    return (
        
        <div className="Nav">
            {token ? <Link to="/dashboard"> dashboard </Link>: <h1></h1>}
            {!token ? <Link to="/login"> Login </Link>: <h1></h1>}
            {!token ? <Link to="/Register"> Register </Link>: <h1></h1>}
        </div>
    )
}