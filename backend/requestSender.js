const bcrypt = require("bcrypt")
const { db } = require('./config');


const signUp = async (req, res) => {
    // sign up
    try { 
        // get data user
        const { login, email, password } = req.body;

        // hash password
        const saltRounds = 10;

        // verification or email is used
        const check_email = 'SELECT email FROM users WHERE email = ?';

        db.get(check_email, [email], async (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to check email in the database' });
            } else if (row) {
                res.status(400).json({ error: 'User with this email already exists' });
            } else {
                const hash_password = await bcrypt.hash(password, saltRounds);
        
                // save in database
                const insertQuery = 'INSERT INTO users (login, email, password) VALUES (?, ?, ?)';
                db.run(insertQuery, [login, email, hash_password], (err) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).json({ error: 'Failed to insert data into the database' });
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // get info user from DB by email
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';

        db.get(getUserQuery, [email], async (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to fetch user data from the database' });
            } else if (!row) {
                res.status(401).json({ error: 'User with this email does not exist' });
            } else {
                // Comparison of the password stored in the database with the entered password
                const bcrypt = require("bcrypt");
                const isPasswordValid = await bcrypt.compare(password, row.password);
                if (isPasswordValid) {
                    res.status(200).json({ user_login: row.login, user_id: row.id }); 
                } else {
                    // else password no valid
                    res.status(401).json({ error: 'Incorrect password' });
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
};


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
        console.log(e);
    }
}


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
        console.log(e);
    }
}


const edit_OwnQuizzes = async (req, res) => {
    try {
        const id_quiz = req.body.quizId;

        // GET info about quiz
        const getQuizQuery = 'SELECT * FROM quizzes WHERE id = ?';
        db.all(getQuizQuery, [id_quiz], async (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to fetch quiz data from the database' });
            } else {
                // send data
                res.status(200).json({ row: row });
            };
        });
    } catch (e) {
        console.log(e);
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
        await db.run(update_quiz, [title, JSON.stringify(questions), JSON.stringify([options]), id_quiz], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update quiz data in the database' });
            } else {
                return res.json({ success: true });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update quiz data in the database' });
    };
};


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
    signUp,
    signIn,
    profile_CreateQuiz,
    getOwnQuizzes,
    edit_OwnQuizzes,
    update_OwnQuiz,
    quizzes
};