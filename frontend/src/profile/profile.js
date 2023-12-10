import React from 'react';
import { Link } from 'react-router-dom';
import '../css/profile.css';
import AnimatedPage from '../quiz/AnimatedPage';

const Profile = () => {
    // data user from session
    const user_email = sessionStorage.getItem('user_email');
    const user_login = sessionStorage.getItem('user_login');


    // button log out
    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload();
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
                    <Link to="/profile/create-quiz">
                        <button className="btn-quiz">Create new quiz</button>
                    </Link>
                    <Link to="/profile/own-quizzes">
                        <button className="btn-quiz">Own quizzes</button>
                    </Link>
                    <Link to="/profile/own-results">
                        <button className="btn-quiz">Own results</button>
                    </Link>
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