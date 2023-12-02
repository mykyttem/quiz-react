import React from 'react';
import { Link } from 'react-router-dom';
import './css/home.css';


const Home = () => {
  return (
    <div>
      <div className="header">
        <h1>Welcome to Quiz App</h1>
        <p>Explore and create quizzes to test your knowledge!</p>
      </div>

      <div className="features">
        <div className="feature">
          <h2>Create Quizzes</h2>
          <p>Build your own quizzes and challenge others.</p>
          <Link to="/profile/create-quiz">Get Started</Link>
        </div>

        <div className="feature">
          <h2>Explore Quizzes</h2>
          <p>Discover a variety of quizzes created by other users.</p>
          <Link to="/quizzes">Explore Quizzes</Link>
        </div>
      </div>
    </div>
  );
};


export default Home;