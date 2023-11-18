import React, { useState } from 'react';
import axios from 'axios';
import './css/modal.css';


const CreateQuizModal = ({ onClose }) => {
    // id user
    const user_id = sessionStorage.getItem('user_id');

    // state for save values
    const [question, setQuestion] = useState(''); 
    const [options, setOptions] = useState(['']); 

    // add new element
    const handleAddOption = () => {
        setOptions([...options, '']); 
    };

    // add options
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // handle question change
    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    // send data
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/profile', {
                question: question,
                options: options,
                user_id: user_id,
            });


            setQuestion('');
            setOptions(['']);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    return (
        <div className="modalQuiz-overlay">
            <div className="modal-quiz">
                <span className="close-button" onClick={onClose}>X</span>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Type question..."
                        value={question}
                        onChange={handleQuestionChange}
                        id="quiz-fields"
                        />
                    <div className="options">
                        {options.map((option, index) => (
                            <input
                            key={index}
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            id="quiz-fields"
                            />
                        ))}
                    </div>

                    <button type="submit">Create</button>
                    <button type="button" onClick={handleAddOption}>Add new option</button>
                </form>
            </div>
        </div>
    );
};


export default CreateQuizModal;