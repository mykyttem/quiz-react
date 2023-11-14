import './css/profile.css';

const Profile = () => {
    const user_email = sessionStorage.getItem('user_email');
    const user_login = sessionStorage.getItem('user_login');

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload();
    }

    if (user_email && user_login) {
        return (
            <div className="profile">
                <h1>User Profile</h1>
                
                <div className="user-info">
                    <p><strong>Name:</strong> {user_email}</p>
                    <p><strong>Email:</strong> {user_login}</p>
                </div>
    
                <button className="logout-button" onClick={handleLogout}>Log Out</button>

                
                <h2>Created Quizzes</h2>
                <ul className="quiz-list">
                    <li>Quiz 1</li>
                    <li>Quiz 2</li>
                    <li>Quiz 3</li>
                </ul>
            </div>
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
