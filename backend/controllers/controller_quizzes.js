const { db } = require('../config');


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
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// import for server
module.exports = {
    quizzes
};