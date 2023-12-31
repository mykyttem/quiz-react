import React, { useState } from "react"; 
import { useHistory } from "react-router-dom";
import '../css/auth.css';
import axios from 'axios'; 

import AnimatedPage from "../quiz/AnimatedPage";


const SignIn = () => {
    // state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [NotSuccessful_auth, setNotSuccessful_auth] = useState(false);

    const history = useHistory();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // send a request to the server for user auth
            const response = await axios.post('/sign-in', {
                email: email,
                password: password
            });

            // if auth successful
            if (response.status === 200) {
                // save in session
                const { user_login, user_id } = response.data;
                sessionStorage.setItem("user_email", email);
                sessionStorage.setItem("user_login", user_login);
                sessionStorage.setItem("user_id", user_id);

                // Redirect to profile page
                history.push("/profile");
            }
        } catch {
            console.error("Authentication error: ");
            setNotSuccessful_auth(true);
        }
    }


    return (
        <AnimatedPage>
            <div className="sign-in">
                <div className="auth-form-container">
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                        <label htmlFor="password">password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        <button type="submit">Log In</button>
                    </form>
                    <button className="link-btn"><a href="/sign-up" className="nav-link">Don't have an account?. Sign Up</a></button>

                    {NotSuccessful_auth && <h1>Invalid email or password</h1>}
                </div>
            </div>
        </AnimatedPage>
    )
};


export default SignIn;