import React from 'react';
import { useState } from 'react';
import '../login/Login.css';

export const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handelSubmit = () =>{
            
    }

    return (
        <div className="Login">
            <div className="info">
            <h3>Login</h3>
            <input type="text" placeholder="email here" onChange={e => setEmail(e.target.value)}></input>
            <input type="password" placeholder="password here" onChange={e => setPassword(e.target.value)}></input>
             <button id="loginBtn" onClick={handelSubmit}>Login</button> {/*//onClick={handelSubmit} */}
            {/* {submitted ? <div className='toast'> <h4>login successfully</h4> </div> : <div></div>} */}
            </div>
        </div>

    )
}


