import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'; 
import axios from 'axios';

import '../css/start_quiz.css';
import AnimatedPage from './AnimatedPage';


const StartQuiz = () => {
    /*
        - show info about quiz
        - button start   
        - redirect on page logic quiz, in url, id quiz, and first question
    */
    const history = useHistory();

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

    
    // redirect
    const redirect_logic = (id_quiz, title) => {
        history.push(`/quizzes/start-quiz/${id_quiz}/${title}`);
        window.location.reload();
    }

    return (
        <div className="container"> 
            <AnimatedPage>
                {quiz.map((q) => (
                    <div key={q} onClick={() => redirect_logic(quizId, q.title)}>
                        <div className="title">{q.title}</div>
                        <div className="info">
                            <p><strong>Amount of Questions:</strong>{Array(q.question).length}</p>
                        </div>
                        
                        <button className="button">Start Quiz</button>
                    </div>
                ))}
            </AnimatedPage>
      </div> 
    )
}


export default StartQuiz;