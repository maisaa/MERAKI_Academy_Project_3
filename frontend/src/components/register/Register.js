import React from 'react';
import { useState, useEffect } from 'react';
import '../register/Register.css';
import axios from 'axios';

export const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(12);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [postErr, setPostErr] = useState(false)

    // useEffect(() => {
    //     // setSubmitted(false);
    // }, [])

    const handelSubmit = (e) => {
        const newUser = { firstName, lastName, age, email, password }
        //client validation
        if (firstName === ''||lastName ==='' || age === undefined || email===''|| password==='') {
            setEmpty(true);
        } else {
            setEmpty(false);
            axios
                .post(`http://localhost:5000/users`, newUser)
                .then(response => {
                    console.log("response.....", response)
                    // server validation
                    if (response.statusText === 'Created') {
                        // setSubmitted(true);
                        setPostErr(false)
                        setSubmitted(true);
                    } else {
                        setSubmitted(false);
                        setPostErr(true);
                    }
                })
                .catch((err) => {
                    console.log('ERR:.......', err);
                    setSubmitted(false);
                    setPostErr(true);
                });
        }
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
                {submitted ? <div className='toast'> <h4>The user has been created successfully</h4> </div> : <div></div>}
                {empty ? <div className='toast'> <h4>Please enter your data</h4> </div> : <div></div> }
                {postErr ? <div className='toast'> <h4>Error happened while register, please try again</h4> </div> : <div></div>}
            </div>
        </div>
    )
}

