import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../css/quizzes.css';
import AnimatedPage from '../quiz/AnimatedPage';


const OwnQuizzes = () => {
    // states
    const user_id = sessionStorage.getItem('user_id');
    const [quizzes, setQuizzes] = useState([]);
    
    // when loading the page
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // send user id
                const response = await axios.post('/profile/own-quizzes', { user_id });

                // get quizzes user 
                setQuizzes(response.data.row);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, [user_id]);


    return (
        <AnimatedPage>
            <div className="quizzes-container">
                {quizzes.map((quiz) => (
                    <Link
                        key={quiz.id}
                        to={`/profile/own-quizzes/edit/${quiz.id}`}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
                        className="quiz-block"
                    >
                        <h1>{quiz.title}</h1>
                        <p>Questions: {Array(quiz.question).length}</p>
                    </Link>
                ))}
            </div>
        </AnimatedPage>
    ); 
};


export default OwnQuizzes;