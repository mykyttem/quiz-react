import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../css/quizzes.css';


const OwnResult = () => {
    // states
    const user_id = sessionStorage.getItem('user_id');
    const [completedQuizzes, setCompletedQuizzes] = useState([]);

    // history routes
    const history = useHistory();

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


    // redirect on page edit quiz after click on quiz
    const redirect_result_answers = (id_quiz) => {
        history.push(`/quizzes/${id_quiz}/${user_id}/results/`);
    }
    

    return (
        <div className="quizzes-container">
            {completedQuizzes.map((quiz) => (
                <div key={quiz.id} onClick={() => redirect_result_answers(quiz.id)} className="quiz-block">
                    <h1>{quiz.title}</h1>
                    <p>Correct answers: {quiz.countCorrect}</p>
                    <p>Questions: {Array(quiz.question).length}</p>
                </div>
            ))}
        </div>
    ); 
}


export default OwnResult;