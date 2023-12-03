import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';

import './css/start_quiz.css';


const StartQuiz = () => {
    /*
        - show info about quiz
        - button start   
    */


    // get id quiz, from url
    const { quizId } = useParams();
    
    // state    
    const [quiz, setQuiz] = useState([]);


    // when loading the page
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // get info about quiz
                const response = await axios.post('/quizzes/start-quiz/:quizId', { quizId });

                // get, and set quiz
                setQuiz(response.data.row);
            } catch (error) {
                console.error(`Error fetching quizzes: ${error}`);
            }
        };

        fetchQuiz();
    }, [quizId]);


    return (
        <div className="container">
            {quiz.map((q) => (
                <div key={q}>
                    <div className="title">{q.title}</div>
                    <div className="info">
                        <p><strong>Amount of Questions:</strong>{Array(q.question).length}</p>
                    </div>
                    <button className="button">Start Quiz</button>
                </div>
            ))}
      </div> 
    )
}


export default StartQuiz;