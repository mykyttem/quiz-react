import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/create_quiz.css';


const EditOwnQuizzes = () => {
    /*
        - Get the quiz ID from the URL
        - Makes a request to the server to retrieve the quiz data from the database
        - Initializes states to store information about the quiz, question, current question index, quiz title, and answer options
        - Fills out the quiz editing form with the data received when the page is loaded
        - Provides an opportunity to add new questions and options to the quiz
        - Updates the quiz data on the server when the "Submit" button is pressed
        - Redirects the user to the profile page and reloads the page
    */


    const history = useHistory();
    
    // states
    const { quizId } = useParams();
    const [info_quiz, setInfoQuiz] = useState([]);

    // save values
    const [questions, setQuestions] = useState(['']);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState([
        [{ value: 'Option 1', isCorrect: false }, { value: 'Option 2', isCorrect: false }, { value: 'Option 3', isCorrect: false }, { value: 'Option 4', isCorrect: false }]
    ]);
      

    // when loading the page
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // send id quiz
                const response = await axios.post('/profile/own-quizzes/edit/:quizId', { quizId });
    
                // get quizzes user
                setInfoQuiz(response.data.row);
    
                // sets
                const initialQuestions = JSON.parse(response.data.row[0].question);
                setQuestions(initialQuestions);
    
                const initialOptions = JSON.parse(response.data.row[0].options).map((options) => options);
                setOptions(initialOptions);
    
                setTitle(response.data.row[0].title);
            } catch (error) {
                console.error(`Error fetching quizzes: ${error}`);
            }
        };
    
        fetchQuizzes();
    }, [quizId]);
    

    // add question
    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
        setOptions((prevOptions) => [
          ...prevOptions,
          [
            { value: 'Option 1', isCorrect: false },
            { value: 'Option 2', isCorrect: false },
            { value: 'Option 3', isCorrect: false },
            { value: 'Option 4', isCorrect: false },
          ],
        ]);
        setCurrentQuestionIndex(questions.length);
    };


    // change option
    const handleOptionChange = (questionIndex, optionIndex, value) => {
        setOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions[questionIndex][optionIndex] = { ...newOptions[questionIndex][optionIndex], value };
          return newOptions;
        });
    };
      
    // change true or false for option
    const handleOptionCorrectnessChange = (questionIndex, optionIndex) => {
        const newOptions = [...options];
        newOptions[questionIndex][optionIndex].isCorrect = !newOptions[questionIndex][optionIndex].isCorrect;
        setOptions(newOptions);
    };

    // change question
    const handleQuestionChange = (questionIndex, value) => {
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            newQuestions[questionIndex] = value;
            return newQuestions;
        });
    };  


    // sumbit and send new data for UPDATE
    const UpdateSubmit = async () => {
        try {
            // get question and answers from all blocks questions
            const dataToSubmit = {
                quizId: quizId,
                title: title,
                question: questions,
                options: options,
            };

            // send
            await axios.post('/profile/own-quizzes/update/:quizId', dataToSubmit);

            // Redirect to profile
            history.push('/profile/own-quizzes');
            window.location.reload();
        } catch (error) {
            console.error(`Error submitting quiz: ${error}`);
        }
    };


    const DeleteQuiz = async () => {
        try {
            // send quiz Id for delete
            await axios.post('/profile/own-quizzes/delete/:quizId', {quizId});

            // reload
            history.push('/profile/own-quizzes');
            window.location.reload();
        } catch (error) {
            console.error(`Error delete quiz: ${error}`);
        }
    };
    
    
    return (
        <div className="quiz-container">
          {info_quiz.map((quizIndex) => (
            <div key={quizIndex}>
              <input
                type="text"
                className="title-quiz"
                placeholder="title quiz..."
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              
              {questions.map((question, index) => (
                <div key={index} className={`question-block ${index === currentQuestionIndex ? 'active' : ''}`}>
                  <input
                    type="text"
                    className="question-input"
                    placeholder={`Type your question ${index + 1}...`}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    value={question}
                  />
                  <div className="options-container">
                    {options[index].map((option, optionIndex) => (
                      <div key={optionIndex} className={`option-card ${option.isCorrect ? 'correct-option' : ''}`}>
                        <input
                          type="text"
                          className="option-input"
                          placeholder={`Enter option ${optionIndex + 1}...`}
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        />
                        <button
                          className={`correctness-button ${option.isCorrect ? 'correct' : 'incorrect'}`}
                          onClick={() => handleOptionCorrectnessChange(index, optionIndex)}
                        >
                          {option.isCorrect ? '✓' : '✗'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
      
              <button className="submit-button" type="button" onClick={UpdateSubmit}>
                Submit
              </button>
              <button className="next-question-button" type="button" onClick={handleAddQuestion}>
                Add Question
              </button>
              <button className="delete-quiz-button" type="button" onClick={DeleteQuiz}>
                Delete
              </button>
            </div>
          ))}
        </div>
    );
};


export default EditOwnQuizzes;