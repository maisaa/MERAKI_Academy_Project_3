import React from 'react';
import { useState } from 'react';
import '../login/Login.css';
import axios from 'axios';

export const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [empty, setEmpty] = useState(false)
    const [submitted, setSubmitted] = useState(false);

    const handelSubmit = () =>{
        const user = { email, password } ;
        
        if(email === '' || password === ''){
            setEmpty(true);
        } else {
            setEmpty(false);
            axios
            .post(`http://localhost:5000/login`, user)

        }
    }

    return (
        <div className="Login">
            <div className="info">
            <h3>Login</h3>
            <input type="text" placeholder="email here" onChange={e => setEmail(e.target.value)}></input>
            <input type="password" placeholder="password here" onChange={e => setPassword(e.target.value)}></input>
             <button id="loginBtn" onClick={handelSubmit}>Login</button> {/*//onClick={handelSubmit} */}
            {submitted ? <div className='toast'> <h4>login successfully</h4> </div> : <div></div>}
            </div>
        </div>

    )
}


