import React from 'react';
import { useState } from 'react';
import '../register/Register.css';

export const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(12);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handelSubmit = (e) => {
        console.log(e.target);

    };
    
    return (
        <div className="Register">
            <h3> Register: </h3>
            <div className="regInfo">
                <input type="text" placeholder="firstName here" onChange={e => setFirstName(e.target.value)}></input>
                <input type="text" placeholder="lastName here" onChange={e => setLastName(e.target.value)}></input>
                <input type="number" placeholder="age here" onChange={e => setAge(e.target.value)}></input>
                <input type="text" placeholder="email here" onChange={e => setEmail(e.target.value)}></input>
                <input type="password" placeholder="password here" onChange={e => setPassword(e.target.value)}></input>
                <button id="registerBtn" onClick={handelSubmit}>Register</button>
            </div>
        </div>
    )
}

