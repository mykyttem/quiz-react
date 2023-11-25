// module dependencies
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// import
const { initDatabase } = require('./config');
const { signUp, signIn, profile_CreateQuiz, getOwnQuizzes } = require('./requestSender');

// connect to the DataBase
initDatabase();

// requests
app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/profile/create-quiz', profile_CreateQuiz);
app.post('/profile/own-quizzes', getOwnQuizzes);


// listening port
const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});