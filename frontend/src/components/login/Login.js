import React from 'react';
import { useState } from 'react';
import { Route, useHistory } from "react-router-dom";
import '../login/Login.css';
import axios from 'axios';

export const Login = ({setToken}) => {
    // console.log("........log...",)

    const history = useHistory();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [empty, setEmpty] = useState(false);
    const [postErr, setPostErr] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const handelSubmit = () =>{
        const user = { email, password } ;
        
        if(email === '' || password === ''){
            setEmpty(true);
        } else {
            setEmpty(false);
            setPostErr(false);
            axios
            .post(`http://localhost:5000/login`, user)
            .then(response => {
                console.log("response......",response.data);
                setLoggedIn(true);
                setToken(response.data.token);
                history.push("/dashboard");
                // console.log(".......token...",setToken(response.data.token))
            })
            .catch((err) =>{
                setLoggedIn(false);
                setPostErr(true);
                console.log("Err ....",err)
                // console.log("Err ....",err.Error.include('404'));//email not found
                // console.log("Err ....",err.Error.include('403'));//password is incorrect
            })
        }
    }

    return (
        <div className="Login">
            <div className="info">
            <h3>Login</h3>
            <input type="text" placeholder="email here" onChange={e => setEmail(e.target.value)}></input>
            <input type="password" placeholder="password here" onChange={e => setPassword(e.target.value)}></input>
            <button id="loginBtn" onClick={handelSubmit}>Login</button> {/*//onClick={handelSubmit} */}
            {empty ? <div className='toast'> <h4>Please enter your data</h4> </div> : <div></div> }
            {postErr ? <div className='toast'> <h4>Email or password is incorrect </h4> </div> : <div></div>}
            {loggedIn ? <div className='toast'> <h4>login successfully</h4> </div> : <div></div>}
            </div>
        </div>
    )
}


