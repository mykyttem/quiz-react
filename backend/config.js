// logger
const winston = require('winston');
const logger = winston.createLogger();

// create and connect to database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) return logger.error(err.message);
});


// create table if not
const users = `CREATE TABLE IF NOT EXISTS users(
                    id INTEGER PRIMARY KEY, 
                    login TEXT, 
                    email TEXT, 
                    password TEXT
                )`;
const quizzes = `CREATE TABLE IF NOT EXISTS quizzes(
                    id INTEGER PRIMARY KEY, 
                    id_author INTEGER, 
                    title TEXT, 
                    question TEXT, 
                    options TEXT,
                    FOREIGN KEY (id_author) REFERENCES users(id)
                )`;
const results = `CREATE TABLE IF NOT EXISTS results(
                    id INTEGER PRIMARY KEY, 
                    id_user INTEGER, 
                    id_quiz INTEGER, 
                    answers JSONB,
                    FOREIGN KEY (id_user) REFERENCES users(id),
                    FOREIGN KEY (id_quiz) REFERENCES users(id)
                )`;

const initDatabase = () => {
    // run
    db.run(users);
    db.run(quizzes);
    db.run(results);
}
 

module.exports = {
    db,
    initDatabase,
    logger
}