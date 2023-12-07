const { db } = require('../config');
const { logger } = require('../config');
const { msg_internalServer, executeQuery, sendResponse } = require('./controller_utils');


const bcrypt = require("bcrypt")


const signUp = async (req, res) => {
    try { 
        // get data user
        const { login, email, password } = req.body;

        // verification or email is used
        const check_email = 'SELECT email FROM users WHERE email = ?';
        const existingUser = await executeQuery(db, check_email, [email]);

        if (existingUser) {
            sendResponse(res, 400, { error: 'User with this email already exists' });
        } else {
            // hash password
            const saltRounds = 10;
            const hash_password = await bcrypt.hash(password, saltRounds);
    
            // save in database
            const insertQuery = 'INSERT INTO users (login, email, password) VALUES (?, ?, ?)';
            await db.run(insertQuery, [login, email, hash_password]);

            sendResponse(res, 200, {});
        } 
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: 'Failed to sign up' });
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // get info user from DB by email
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const user = await executeQuery(db, getUserQuery, [email]);

        if (!user) {
            sendResponse(res, 401, { error: 'User with this email does not exist' });
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {
                sendResponse(res, 200, { user_login: user.login, user_id: user.id });
            } else {
                sendResponse(res, 401, { error: 'Incorrect password' });
            }
        }
    } catch (e) {
        logger.error(e);
        sendResponse(res, 500, { error: msg_internalServer });
    }
};


// import for server
module.exports = {
    signUp,
    signIn
};