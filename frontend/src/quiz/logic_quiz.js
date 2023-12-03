import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';

import AnimatedPage from './AnimatedPage';
import '../css/logic_quiz.css';


const LogicQuiz = () => {
    /*
        - Retrieves the quiz ID from the URL
        - Fetches quiz data from the server by making a POST request
        - 'quiz': Stores information about the loaded quiz.
        - 'selectedOptions': Keeps track of the selected options for each quiz question.
    */

        
    // get id quiz, from url
    const { quizId } = useParams();

    // state
    const [quiz, setQuiz] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});

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
    

    // Function that handles clicking on options in quiz questions.
    // It updates the selectedOptions state by adding or updating the selected option index for the corresponding question.
    const handleOptionClick = (questionIndex, optionIndex) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [questionIndex]: optionIndex,
        }));
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
                                            className={`option-card-l ${selectedOptions[questionIndex] === optionIndex ? 'selected' : ''}`}
                                            onClick={() => handleOptionClick(questionIndex, optionIndex)}
                                            style={{ backgroundColor: selectedOptions[questionIndex] === optionIndex ? '#8aff8a' : 'background-color: #e0e0e0' }}
                                        >
                                            {option.value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="button">Done</button>
                    </div>
                ))}
            </AnimatedPage>
        </div>
    );
};
 

export default LogicQuiz;