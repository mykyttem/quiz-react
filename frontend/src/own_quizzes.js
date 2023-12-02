import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './css/quizzes.css';


const OwnQuizzes = () => {
    // states
    const user_id = sessionStorage.getItem('user_id');
    const [quizzes, setQuizzes] = useState([]);
    
    // history routes
    const history = useHistory();

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


    // redirect on page edit quiz after click on quiz
    const redirect_editQuiz = (id_quiz) => {
        history.push(`/profile/own-quizzes/edit/${id_quiz}`);
        window.location.reload();
    }


    return (
        <div className="quizzes-container">
            {quizzes.map((quiz) => (
                <div key={quiz.id} onClick={() => redirect_editQuiz(quiz.id)} className="quiz-block">
                    <h1>{quiz.title}</h1>
                    <p>Questions: {Array(quiz.question).length}</p>
                </div>
            ))}
        </div>
    ); 
};


export default OwnQuizzes;