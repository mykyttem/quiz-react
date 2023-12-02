const { db } = require('../config');
const { logger } = require('../config');

/*
    all profile-related components that can be accessed through the user's profile
*/


const profile_CreateQuiz = async (req, res) => {
    try {
        // get json data
        const data = req.body; 

        // get all questions in one list and options
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
        // get id user
        const user_id = req.body.user_id;


        // Fetch quizzes for the user
        const getQuizzes_user = 'SELECT * FROM quizzes WHERE id_author = ?';
        const quizzesRow = await new Promise((resolve, reject) => {
            db.all(getQuizzes_user, [user_id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        // Check if quizzes exist for the user
        if (quizzesRow) {
            // Send the response
            res.status(200).json({
                row: quizzesRow
            });
        } else {
            res.status(404).json({ error: 'Quizzes not found for the user' });
        }
    } catch (e) {
        logger.error(e);
    }
};


const edit_OwnQuizzes = async (req, res) => {
    try {
        const id_quiz = req.body.quizId;

        // GET info about quiz
        const getQuizQuery = 'SELECT * FROM quizzes WHERE id = ?';
        db.all(getQuizQuery, [id_quiz], async (err, row) => {
            if (err) {
                logger.error(err.message);
                res.status(500).json({ error: 'Failed to fetch quiz data from the database' });
            } else {
                // send data
                res.status(200).json({ row: row });
            };
        });
    } catch (e) {
        logger.error(e);
    };
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
        await db.run(update_quiz, [title, JSON.stringify(questions), JSON.stringify(options), id_quiz], function (err) {
            if (err) {
                logger.error(err.message);
                res.status(500).json({ error: 'Failed to update quiz data in the database' });
            } else {
                return res.json({ success: true });
            }
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: 'Failed to update quiz data in the database' });
    };
};


const delete_OwnQuiz = async (req, res) => {
    try {
        const quiz_id = req.body.quizId;
        const delete_quiz = 'DELETE FROM quizzes WHERE id = ?';

        await db.run(delete_quiz, [quiz_id], function (err) {
            if (err) {
                logger.error(err.message);
                res.status(500).json({ error: 'Failed to delete quiz from the database' });
            } else {
                return res.json({ success: true });
            }
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: 'Failed to delete quiz from the database' });
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