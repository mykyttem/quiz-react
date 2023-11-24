import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './css/create_quiz.css';


const CreateQuiz = () => {
    // state
    const history = useHistory();
    const user_id = sessionStorage.getItem('user_id');

    // save values
    const [questions, setQuestions] = useState([{ question: '', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [title, setTitle] = useState('');

    // add question
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }]);
        setCurrentQuestionIndex(questions.length);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (questionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].question = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        try {
            // get question and answers from all blocks questions
            const dataToSubmit = questions.map(({ question, options }) => ({
                title: title,
                question: question,
                options: options,
                user_id: user_id,
            }));

            await axios.post('/profile/create-quiz', dataToSubmit);
            
            // Redirect to profile
            // FIXME
            history.push('/profile');
            window.location.reload();
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
        <div className="quiz-container">
            <input type="text" className="title-quiz" placeholder="title quiz..." onChange={(e) => setTitle(e.target.value)}/>
            {questions.map((q, index) => (
                <div key={index} className={`question-block ${index === currentQuestionIndex ? 'active' : ''}`}>

                    <input
                        type="text"
                        className="question-input"
                        placeholder={`Type your question ${index + 1}...`}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        value={q.question}
                    />
                    <div className="options-container">
                        {q.options.map((option, optionIndex) => (
                            <div
                                key={optionIndex}
                                className="option-card"
                                onClick={() => handleOptionChange(index, optionIndex, prompt(`Enter new option for question ${index + 1}:`, option))}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button className="submit-button" type="button" onClick={handleSubmit}>
                Submit
            </button>
            <button className="next-question-button" type="button" onClick={handleAddQuestion}>
                Add Question
            </button>
        </div>
    );
};


export default CreateQuiz;