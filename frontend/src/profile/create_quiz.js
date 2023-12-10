import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/create_quiz.css';
import AnimatedPage from '../quiz/AnimatedPage';


const CreateQuiz = () => {
    // state
    const history = useHistory();
    const user_id = sessionStorage.getItem('user_id');

    // save values
    const [questions, setQuestions] = useState([
        { question: '', options: [{ value: 'Option 1', isCorrect: false }, { value: 'Option 2', isCorrect: false }, { value: 'Option 3', isCorrect: false }, { value: 'Option 4', isCorrect: false }] }
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [title, setTitle] = useState('');

    // add question
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }]);
        setCurrentQuestionIndex(questions.length);
    };

    // option change
    const handleOptionChange = (questionIndex, optionIndex, value, isCorrect) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = { value, isCorrect };
        setQuestions(newQuestions);
    };
    
    // change true or false for option
    const handleOptionCorrectnessChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex].isCorrect = !newQuestions[questionIndex].options[optionIndex].isCorrect;
        setQuestions(newQuestions);
    };

    // change question
    const handleQuestionChange = (questionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].question = value;
        setQuestions(newQuestions);
    };  

    // send for server
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
            history.push('/profile/own-quizzes');
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (user_id) {
        return (
            <AnimatedPage>
                <div className="quiz-container">
                    <input type="text" className="title-quiz" placeholder="title quiz..." onChange={(e) => setTitle(e.target.value)} required/>
                    {questions.map((q, questionIndex) => (
                        <div key={questionIndex} className={`question-block ${questionIndex === currentQuestionIndex ? 'active' : ''}`} required>
        
                            <input
                                type="text"
                                className="question-input"
                                placeholder={`Type your question ${questionIndex + 1}...`}
                                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                value={q.question}
                            />
                            <div className="options-container">
                                {q.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="option-card">
                                        <input
                                            type="text"
                                            className="option-input"
                                            placeholder={`Enter option ${optionIndex + 1}...`}
                                            value={option.value}
                                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value, option.isCorrect)}
                                        />
                                        <button
                                            className={`correctness-button ${option.isCorrect ? 'correct' : 'incorrect'}`}
                                            onClick={() => handleOptionCorrectnessChange(questionIndex, optionIndex)}
                                        >
                                            {option.isCorrect ? '✓' : '✗'}
                                        </button>
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
            </AnimatedPage>
        );
    } else {
        return (
            <div className="profile">
                <h1>User Profile</h1>
        
                <div className="user-info">
                    <h1 style={{ color: 'red' }}>Please register or sign in</h1>
                </div>
            </div>
        )
    }

};


export default CreateQuiz;