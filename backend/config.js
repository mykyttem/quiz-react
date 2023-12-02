// logger
const winston = require('winston');
const logger = winston.createLogger();

// create and connect to database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) return logger.error(err.message);
});


// create table if not
const sql_table_users = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT, email TEXT, password TEXT)';
const sql_table_quizzes = 'CREATE TABLE IF NOT EXISTS quizzes(id INTEGER PRIMARY KEY, id_author INTEGER, title TEXT, question TEXT, options TEXT)';

const initDatabase = () => {
    // run
    db.run(sql_table_users);
    db.run(sql_table_quizzes);
}
 

module.exports = {
    db,
    initDatabase,
    logger
}