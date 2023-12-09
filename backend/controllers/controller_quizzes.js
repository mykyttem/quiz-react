const { db } = require('../config');
const { logger } = require('../config');
const { msg_failed_db, msg_internalServer, executeQuery, sendResponse } = require('./controller_utils');


const quizzes = async (req, res) => {
    try {
        // get all quizzes users        
        const getQuizzes = 'SELECT * FROM quizzes';
        const quizzesRows = await executeQuery(db, getQuizzes, [], 'all');

        if (quizzesRows.length > 0) {
            // Fetch author logins
            const authorIds = quizzesRows.map((quiz) => quiz.id_author);

            const placeholders = authorIds.map(() => '?').join(',');
            const getLogin_author = 'SELECT id, login FROM users WHERE id IN (' + placeholders + ')';
            const authorRows = await executeQuery(db, getLogin_author, authorIds, 'all');  
          

            // Create a mapping of author IDs to logins for easier lookup
            const authorLoginMap = {};
            authorRows.forEach((author) => {
                authorLoginMap[author.id] = author.login;
            });

            // Add login information to each quiz row
            const quizzesWithLogins = quizzesRows.map((quiz) => {
                return {
                    ...quiz,
                    author_login: authorLoginMap[quiz.id_author],
                };
            });

            // send the response
            sendResponse(res, 200, { row: quizzesWithLogins });
        } else {
            sendResponse(res, 404, { error: 'Quizzes not found' });
        }
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: msg_internalServer });
    }
};


const getQuizInfo = async (req, res, query, params) => {
    try {
      const rows = await executeQuery(db, query, params, 'all');
      sendResponse(res, 200, { row: rows });
    } catch (e) {
      logger.error(e.message);
      sendResponse(res, 500, { error: msg_failed_db });
    }
};


const startQuiz = async (req, res) => {
    const id_quiz = req.body.quizId;
    const info_quiz = 'SELECT title, question FROM quizzes WHERE id = ?';
    getQuizInfo(req, res, info_quiz, [id_quiz]);
};


const logicQuiz = async (req, res) => {
    const id_quiz = req.body.quizId;
    const info_quiz = 'SELECT title, question, options FROM quizzes WHERE id = ?';
    getQuizInfo(req, res, info_quiz, [id_quiz]);
};


const logicQuiz_saveResults = async (req, res) => {
    const { answers, user_id, quizId } = req.body;

    
    try {
        const array = Object.values(answers).flat();
        
        const groupedData = array.reduce((acc, item) => {
            const { Question, Option } = item;
            acc[Question] = acc[Question] ? [...acc[Question], Option] : [Option];
            return acc;
          }, {});

        // save
        const save = 'INSERT INTO results(id_user, id_quiz, answers) VALUES (?, ?, ?)';
        await db.run(save, [user_id, quizId, JSON.stringify(groupedData)]);

        sendResponse(res, 200, {});
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: msg_internalServer });
    }
};


const resultsQuiz = async (req, res) => {
    const {quizId, user_id} = req.body;

    try {
        // get from DB
        const result = 'SELECT answers FROM results WHERE id_user = ? AND id_quiz = ?';
        const quiz = 'SELECT title, question, options FROM quizzes WHERE id = ?';

        const rows_results = await executeQuery(db, result, [quizId, user_id], 'all');
        const rows_quiz = await executeQuery(db, quiz, [quizId], 'all');

        // send values
        res.status(200).json({
            results: rows_results,
            quiz: rows_quiz,
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: msg_internalServer })
    }
};


const deleteResult = async (req, res) => {
    const {quizId, user_id} = req.body;

    try {
        // delete
        const delete_result = 'DELETE FROM results WHERE id_quiz = ? AND id_user = ?';
        await db.run(delete_result, [quizId, user_id]);

        sendResponse(res, 200, {});
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, {error: msg_internalServer})
    }
};


// import for server
module.exports = {
    quizzes,
    startQuiz,

    logicQuiz,
    logicQuiz_saveResults,
    resultsQuiz,
    deleteResult
};