import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../css/quizzes.css';


const Quizzes = () => {
    /*
        - get all quizzes users
        - show quiz in blocks
        - click on block, for start quiz
    */

        
    // state
    const [quizzes, setQuizzes] = useState([]);

    // history 
    const history = useHistory();

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


    // redirect on page startQuiz
    const redirect_StartQuiz = (id_quiz) => {
        history.push(`/quizzes/start-quiz/${id_quiz}`);
    }


    return (
        <div className="quizzes-container">
            {quizzes.map((quiz) => (
                <div key={quiz.id} onClick={() => redirect_StartQuiz(quiz.id)} className="quiz-block">
                    <h1>{quiz.title}</h1>
                    <p>Questions: {Array(quiz.question).length}</p>
                    <h1>{quiz.author_login}</h1>
                </div>
            ))}
        </div>
    );
}


export default Quizzes;