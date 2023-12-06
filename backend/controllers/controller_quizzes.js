const { db } = require('../config');
const { logger } = require('../config');


const msg_internalServer = 'Internal server error';
const msg_failed_db = 'Failed to fetch quiz data from the database';


const quizzes = async (req, res) => {
    try {
        // get all quizzes users        
        const get_Quizzes = 'SELECT * FROM quizzes';
        const quizzesRows = await new Promise((resolve, reject) => {
            db.all(get_Quizzes, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        if (quizzesRows.length > 0) {
            // Fetch author logins
            const authorIds = quizzesRows.map((quiz) => quiz.id_author);

            const placeholders = authorIds.map(() => '?').join(',');
            const getLogin_author = 'SELECT id, login FROM users WHERE id IN (' + placeholders + ')';
            
            const authorRows = await new Promise((resolve, reject) => {
                db.all(getLogin_author, authorIds, (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });

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
            res.status(200).json({
                row: quizzesWithLogins,
            }); 
        } else {
            res.status(404).json({ error: 'Quizzes not found' });
        }
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: msg_internalServer });
    }
};


const startQuiz = async (req, res) => {
    const id_quiz = req.body.quizId;

    try {
        const info_quiz = 'SELECT title, question FROM quizzes WHERE id = ?';
        db.all(info_quiz, [id_quiz], async (err, row) => {
            if (err) {
                logger.error(err.message);
                res.status(500).json({ error: msg_failed_db });
            } else {
                // send data
                res.status(200).json({ row: row });
            };
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: msg_internalServer })
    }
};


const logicQuiz = async (req, res) => {
    const id_quiz = req.body.quizId;

    try {
        const info_quiz = 'SELECT title, question, options FROM quizzes WHERE id = ?';
        db.all(info_quiz, [id_quiz], async (err, row) => {
            if (err) {
                logger.error(err.message);
                res.status(500).json({ error: msg_failed_db });
            } else {
                // send data
                res.status(200).json({ row: row });
            };
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: msg_internalServer })
    }
};


const logicQuiz_saveResults = async (req, res) => {
    const { answers, user_id, quizId } = req.body;

    
    try {
        const array = Object.values(answers).flat();
        
        const groupedData = array.reduce((acc, item) => {
            const { Question, Option } = item;

            // check whether such a question already exists in the object
            if (acc[Question]) {
                // If so, then add this response to the existing response array
                acc[Question].push(Option);
            } else {
                // If not, then we create a new array of answers for this question
                acc[Question] = [Option];
            }

            return acc;
        }, {});

        // save
        const save = 'INSERT INTO results(id_user, id_quiz, answers) VALUES (?, ?, ?)';
        await db.run(save, [user_id, quizId,  JSON.stringify(groupedData)]);

        res.status(200);
    } catch (e) {
        logger.error(e);
        res.status(500).json({ error: msg_internalServer })
    }
};


// import for server
module.exports = {
    quizzes,
    startQuiz,

    logicQuiz,
    logicQuiz_saveResults
};