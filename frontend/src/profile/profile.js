import React from 'react';
import { useHistory } from "react-router-dom";
import '../css/profile.css';
import AnimatedPage from '../quiz/AnimatedPage';

const Profile = () => {
    // data user from session
    const user_email = sessionStorage.getItem('user_email');
    const user_login = sessionStorage.getItem('user_login');

    const history = useHistory();

    // button log out
    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload();
    }


    const redirectPage_CreateQuiz = () => {
        history.push("/profile/create-quiz");
    }

    const redirectPage_OwnQuizzes = () => {
        history.push("/profile/own-quizzes");
    }

    const redirectPage_OwnResults = () => {
        history.push("/profile/own-results")
    }

    if (user_email && user_login) {
        return (
            <AnimatedPage>
                <div className="profile">
                    <h1>User Profile</h1>
                    
                    <div className="user-info">
                        <p><strong>Name:</strong> {user_email}</p>
                        <p><strong>Email:</strong> {user_login}</p>
                    </div>
        
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>

                    
                    <h2>Quizzes</h2>
                    <button className="btn-quiz" onClick={redirectPage_CreateQuiz}>Create new quiz</button>
                    <button className="btn-quiz" onClick={redirectPage_OwnQuizzes}>Own quizzes</button>
                    <button className="btn-quiz" onClick={redirectPage_OwnResults}>Own results</button>
                </div>
            </AnimatedPage>
        );
    } else {
        return (
            <div className="profile">
                <h1>User Profile</h1>
        
                <div className="user-info">
                    <h1 style={{ color: 'red' }}>Please register or sign in</h1>
                </div>
            </div>
        );
    }
};


export default Profile;