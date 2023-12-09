// module dependencies
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


// import
const { initDatabase, logger } = require('./config');

const { profile_CreateQuiz, getOwnQuizzes, edit_OwnQuizzes, update_OwnQuiz, delete_OwnQuiz } = require('./controllers/controller_profile');
const { signUp, signIn } = require('./controllers/controller_auth');
const { quizzes, startQuiz, logicQuiz, logicQuiz_saveResults, resultsQuiz, deleteResult } = require('./controllers/controller_quizzes');


// connect to the DataBase
initDatabase();

// requests
app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

app.post('/profile/create-quiz', profile_CreateQuiz);
app.post('/profile/own-quizzes', getOwnQuizzes);
app.post('/profile/own-quizzes/edit/:quizId', edit_OwnQuizzes);
app.post('/profile/own-quizzes/update/:quizId', update_OwnQuiz);
app.post('/profile/own-quizzes/delete/:quizId', delete_OwnQuiz);

app.post('/quizzes', quizzes)
app.post('/quizzes/start-quiz/:quizId', startQuiz);
app.post('/quizzes/start-quiz/:quizId/:title', logicQuiz);
app.post('/quizzes/start-quiz/:quizId/:title/save-results', logicQuiz_saveResults);
app.post('/quizzes/:quizId/:userId/results', resultsQuiz);
app.post('/quizzes/:quizId/:userId/delete/results', deleteResult);


// listening port
const port = 3000;
app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});