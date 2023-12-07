const { db } = require('../config');
const { logger } = require('../config');
const { msg_failed_db, executeQuery, sendResponse } = require('./controller_utils');

/*
    all profile-related components that can be accessed through the user's profile
*/


const profile_CreateQuiz = async (req, res) => {
    try {
        // get json data
        // get all questions in one list and options
        const data = req.body; 
        const author_id = data[0].user_id;
        const title = data[0].title;
        const questions = data.map(item => item.question);
        const options = data.map(item => item.options);

        // Save quiz in DB
        const save_quiz = 'INSERT INTO quizzes(id_author, title, question, options) VALUES (?, ?, ?, ?)';
        await db.run(save_quiz, [author_id, title, JSON.stringify(questions), JSON.stringify(options)]);
    } catch (e) {
        logger.error(e);
    }
};


const getOwnQuizzes = async (req, res) => {
    try { 
        // Fetch quizzes for the user
        const user_id = req.body.user_id;
        const getQuizzes_user = 'SELECT * FROM quizzes WHERE id_author = ?';
        const quizzesRow = await executeQuery(db, getQuizzes_user, [user_id], 'all'); 
              
        // Check if quizzes exist for the user
        if (quizzesRow) {
            sendResponse(res, 200, { row: quizzesRow });
        } else {
            sendResponse(res, 404, { error: 'Quizzes not found for the user' });
        }
    } catch (e) {
        logger.error(e);
    }
};


const getQuizInfo = async (res, id_quiz, query) => {
    try {
      const row = await executeQuery(db, query, [id_quiz], 'all');
      sendResponse(res, 200, { row: row });
    } catch (e) {
      logger.error(e);
      sendResponse(res, 500, { error: msg_failed_db });
    }
};
  

const edit_OwnQuizzes = async (req, res) => {
    const id_quiz = req.body.quizId;

    // GET info about quiz
    const getQuizQuery = 'SELECT * FROM quizzes WHERE id = ?';
    getQuizInfo(res, id_quiz, getQuizQuery);
};


const update_OwnQuiz = async (req, res) => {
    try {
        // get data
        const data = req.body;

        const id_quiz = data.quizId;
        const title = data.title;
        const questions = data.question;
        const options = data.options;

        // UPDATE
        const update_quiz = 'UPDATE quizzes SET title = ?, question = ?, options = ? WHERE id = ?';
        await db.run(update_quiz, [title, JSON.stringify(questions), JSON.stringify(options), id_quiz]);

        sendResponse(res, 200, { success: true });
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: 'Failed to update quiz data in the database' });
    };
};


const delete_OwnQuiz = async (req, res) => {
    try {
        const quiz_id = req.body.quizId;

        const delete_quiz = 'DELETE FROM quizzes WHERE id = ?';
        await db.run(delete_quiz, [quiz_id]);

        sendResponse(res, 200, { success: true });
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: 'Failed to delete quiz from the database' });
    };
};


// import for server
module.exports = {
    profile_CreateQuiz,
    getOwnQuizzes,
    edit_OwnQuizzes,
    update_OwnQuiz,
    delete_OwnQuiz
};