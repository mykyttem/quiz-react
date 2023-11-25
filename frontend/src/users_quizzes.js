import axios from 'axios';
import { useState, useEffect } from 'react';
import './css/quizzes.css';


const Quizzes = () => {
    // states
    const [quizzes, setQuizzes] = useState([]);

    // when loading the page
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // get quizzes all users
                const response = await axios.post('/quizzes');
                setQuizzes(response.data.row);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);


    return (
        <div className="quizzes-container">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-block">
                    <h1>{quiz.title}</h1>
                    <p>Questions: {Array(quiz.question).length}</p>
                    <h1>{quiz.author_login}</h1>
                </div>
            ))}
        </div>
    );
}


export default Quizzes;