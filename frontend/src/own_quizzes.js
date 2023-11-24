import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/own_quizzes.css';


const OwnQuizzes = () => {
    // get id user
    const user_id = sessionStorage.getItem('user_id');

    // state 
    const [quizzes, setQuizzes] = useState([]);

    // get quizzes  
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // send id user
                const response = await axios.post('/profile/own-quizzes', { user_id });

                // get data
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, [user_id]);

    
    return (
        <div className="blocks-quizzes">
            <div className="quiz-block">
                <div key={quizzes.id}>
                    <h2> {quizzes.title}</h2>
                    <p>Author: {quizzes.author}</p>
                    <p>Questions: {quizzes.amount_questions}</p>
                </div>
            </div>
        </div>
    );
};


export default OwnQuizzes;