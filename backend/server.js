// module dependencies
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


// create and connect to database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});


// create table if not
const sql_table_users = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT, email TEXT, password TEXT)';
db.run(sql_table_users);

const sql_table_quizzes = 'CREATE TABLE IF NOT EXISTS quizzes(id INTEGER PRIMARY KEY, id_author INTEGER, question TEXT, options TEXT)';
db.run(sql_table_quizzes);


// sign up
try {
    app.post('/sign-up', async (req, res) => {
        // get data user
        const { login, email, password } = req.body;

        // hash password
        const bcrypt = require("bcrypt")
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
    });
} catch (e) {
    console.log(e);
}


// sign in
app.post('/sign-in', async (req, res) => {
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
});


// create quiz
app.post('/profile', async (req, res) => {
    const {question, options, user_id} = req.body;

    // save in DB
    const save_quiz = 'INSERT INTO quizzes(id_author, question, options) VALUES (?, ?, ?)';
    db.run(save_quiz, [user_id, question, String(options)]);
})


// listening port
const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});