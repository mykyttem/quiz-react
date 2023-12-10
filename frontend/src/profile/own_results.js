import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../css/quizzes.css';
import AnimatedPage from '../quiz/AnimatedPage';


const OwnResult = () => {
    // states
    const user_id = sessionStorage.getItem('user_id');
    const [completedQuizzes, setCompletedQuizzes] = useState([]);


    // when loading the page
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // send user id
                const response = await axios.post('/profile/own-results', { user_id });

                // get quizzes user 
                const quizzesArray = Object.values(response.data.row);
                setCompletedQuizzes(quizzesArray);
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };

        fetchQuizzes();
    }, [user_id]);
    

    return (
        <AnimatedPage>
            <div className="quizzes-container">
                {completedQuizzes.map((quiz) => (
                    <Link
                        key={quiz.id}
                        to={`/quizzes/${quiz.id}/${user_id}/results/`}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
                        className="quiz-block"
                    >
                        <h1>{quiz.title}</h1>
                        <p>Correct answers: {quiz.countCorrect}</p>
                        <p>Questions: {Array(quiz.question).length}</p>
                    </Link>
                ))}
            </div>
        </AnimatedPage>
    ); 
}


export default OwnResult;