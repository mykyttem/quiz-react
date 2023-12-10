import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'; 
import axios from 'axios';
import AnimatedPage from './AnimatedPage';


const ResultsQuiz = () => {
    /*
        - get from DB results, and quiz for displaying results
        - parse data
        - displaying results: green correct, red incorrect, other default, and num for corrects and incorrects
        - button for "do again", when click window confirmed, if yeas - delete from DB results and redirect on page quiz
    */

    const history = useHistory();

    // get id user from sessuib
    const user_id = sessionStorage.getItem('user_id');

    // get id quiz, from url
    const { quizId } = useParams();

    // values
    const [quiz, setQuiz] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);

    // when loading the page
    useEffect(() => {
        const fetchResultQuiz = async () => {
            try {
                const response = await axios.post(`/quizzes/${quizId}/${user_id}/results`, { quizId, user_id });
                
                // get result user
                const answers = response.data.results.map(result => JSON.parse(result.answers));
                const correct = [];
                const incorrect = [];
                
                // get answers
                answers.forEach(answer => {
                    Object.keys(answer).forEach(question => {
                        answer[question].forEach(option => {
                            if (option.isCorrect) {
                                // add for correct answers
                                correct.push(option.value);
                            } else {
                                // add for incorrect
                                incorrect.push(option.value);
                            }
                        });
                    });
                });

                // sets
                setQuiz(response.data.quiz);                
                setCorrectAnswers(correct);
                setIncorrectAnswers(incorrect);
            } catch (error) {
                console.error(`Error fetching result quiz: ${error}`);
            }
        };

        fetchResultQuiz();
    }, [quizId, user_id]);

    // go agian quiz
    const btn_again = async () => {
        // window for confirm
        const isConfirmed = window.confirm('are you sure about it?')

        // if yes:
        if (isConfirmed) {
            // post for delete result
            await axios.post(`/quizzes/${quizId}/${user_id}/delete/results`, { quizId, user_id });

            // redirect on page quiz
            history.push(`/quizzes/start-quiz/${quizId}`);
        }
    };

    return (    
        <div className="container">
            <AnimatedPage>
                <h1 style={{ textAlign: 'right' }}>Number of correct: {correctAnswers.length}</h1>
                <h1 style={{ textAlign: 'right' }}>Number of incorrect ones: {incorrectAnswers.length}</h1>

                {quiz.map((q, index) => (
                    <div key={index}>
                        <h1>{q.title}</h1>

                        {JSON.parse(q.question).map((question, questionIndex) => (
                            <div key={questionIndex} className="question-block">
                                <h1>{question}</h1>

                                <div className="options-container-l">
                                    {JSON.parse(q.options)[questionIndex].map((option, optionIndex) => (
                                        <div
                                            key={optionIndex}
                                            className={`option-card-l`}
                                            style={{
                                                backgroundColor: correctAnswers.includes(option.value)
                                                    ? '#aaffaa' // green, for correct answers
                                                    : incorrectAnswers.includes(option.value)
                                                    ? '#ffaaaa' // red, for incorrect
                                                    : '#e0e0e0', // default color
                                            }}
                                        >
                                            {option.value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="button" onClick={btn_again}>Do again</button>
                    </div>
                ))}
            </AnimatedPage>
        </div>
    );
}


export default ResultsQuiz;