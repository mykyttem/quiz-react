const { db } = require('../config');
const bcrypt = require("bcrypt")


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


// import for server
module.exports = {
    signUp,
    signIn
};