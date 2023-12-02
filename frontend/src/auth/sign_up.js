import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios'; 
import '../css/auth.css';

const SignUp = () => {
    // state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setName] = useState('');

    const [emailInUse, setEmailInUse] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {   
        e.preventDefault();

        try {
            // send data on server for save
            await axios.post('/sign-up', {
                login: login,
                email: email,
                password: password
            });
        
            history.push("/sign-in");
            window.location.reload();
        } catch (error) {
            // email using
            if (error.response && error.response.data && error.response.data.error === 'User with this email already exists') {
                setEmailInUse(true);
            }
        }
    }

    
    return (
        <div className="sign-up">
            <div className="auth-form-container">
                <h2>Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">login</label>
                    <input value={login} name="login" onChange={(e) => setName(e.target.value)} id="login" placeholder="login" />
                    <label htmlFor="email">email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                    <label htmlFor="password">password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <button type="submit">Register</button> 
                </form>
                <button className="link-btn"><a href="/sign-in">Already have an account? Login here</a></button>
                {emailInUse && <h1>Email is already in use</h1>}
            </div>
        </div>
    )
};

export default SignUp;
