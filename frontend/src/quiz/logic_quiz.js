import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'; 
import axios from 'axios';

import AnimatedPage from './AnimatedPage';
import '../css/logic_quiz.css';


const LogicQuiz = () => {
    /*
        - Retrieves the quiz ID from the URL
        - Fetches quiz data from the server by making a POST request
        - 'quiz': Stores information about the loaded quiz
        - 'selectedOptions': Keeps track of the selected options for each quiz question
        - save answers user in DB
    */

    const history = useHistory();

    // get id quiz, from url
    const { quizId } = useParams();

    // state
    const [quiz, setQuiz] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});

    // state for save answers user
    const [answers, setAnswers] = useState({});


    // when loading the page
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // get info about quiz
                const response = await axios.post(`/quizzes/start-quiz/${quizId}/title`, { quizId });

                // get, and set quiz
                setQuiz(response.data.row);
            } catch (error) {
                console.error(`Error fetching quizzes: ${error}`);
            }
        };

        fetchQuiz();
    }, [quizId]);
    


    // ===== FIXME: GET ONLY FIRST QUESTION, second get error =======

    
    // Function that handles clicking on options in quiz questions.
    // It updates the selectedOptions state by adding or updating the selected option index for the corresponding question.
    const handleOptionClick = (questionIndex, optionIndex) => {
        
        
        // Update the selectedOptions state when an option is clicked
        setSelectedOptions((prevState) => {
            const currentOptions = prevState[questionIndex] || [];
            const updatedOptions = [...currentOptions, optionIndex];

            // Return a new state object with updated selected options for the question
            return {
                ...prevState,
                [questionIndex]: updatedOptions,
            };
        });
        
        // Extract the selected question and option for the clicked optionIndex
        const selectedQuestion = JSON.parse(quiz[questionIndex].question)[questionIndex];
        const selectedOption = JSON.parse(quiz[questionIndex].options)[questionIndex][optionIndex];
        
        // Update the answers state when an option is clicked
        setAnswers((prevAnswers) => {
            const currentAnswers = prevAnswers[questionIndex] || [];
            const updatedAnswers = [
                ...currentAnswers,
                {
                    "Question": selectedQuestion,
                    "Option": selectedOption,
                },
            ];

            // Return a new state object with updated selected answers for the question
            return {
                ...prevAnswers,
                [questionIndex]: updatedAnswers,
            };
        });
    };
    
    
    // get id user
    const user_id = sessionStorage.getItem('user_id');

    // save
    const save_answers = async () => {
        try {
            await axios.post('/quizzes/start-quiz/:quizId/:title/save-results', { answers, user_id, quizId });

            history.push(`/quizzes/${quizId}/${user_id}/results`);
            window.location.reload();
        } catch (e) {
            console.error(`Error save: ${e}`);
        }
    };


    return (    
        <div className="container">
            <AnimatedPage>
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
                                        className={`option-card-l ${selectedOptions[questionIndex]?.includes(optionIndex) ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(questionIndex, optionIndex)}
                                        style={{ backgroundColor: selectedOptions[questionIndex]?.includes(optionIndex) ? '#8aff8a' : '#e0e0e0' }}
                                    >
                                            {option.value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="button" onClick={save_answers}>Done</button>
                    </div>
                ))}
            </AnimatedPage>
        </div>
    );
};
 

export default LogicQuiz;