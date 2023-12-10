import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../css/quizzes.css';
import AnimatedPage from './AnimatedPage';


const Quizzes = () => {
    /*
        - get all quizzes users
        - show quiz in blocks
        - click on block, for start quiz
    */

        
    // state
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
        <AnimatedPage>
            <div className="quizzes-container">
                {quizzes.map((quiz) => (
                    // Use Link for navigation
                    <Link 
                        key={quiz.id} 
                        to={`/quizzes/start-quiz/${quiz.id}`} 
                        style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} 
                        className="quiz-block"
                    >
                        <h1>{quiz.title}</h1>
                        <p>Questions: {Array(quiz.question).length}</p>
                        <h1>{quiz.author_login}</h1>
                    </Link>
                ))}
            </div>
        </AnimatedPage>
    );
}


export default Quizzes;