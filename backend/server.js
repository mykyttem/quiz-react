// module dependencies
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


// import
const { initDatabase, logger } = require('./config');

const { profile_CreateQuiz, getOwnQuizzes, edit_OwnQuizzes, update_OwnQuiz, delete_OwnQuiz, getOwn_results } = require('./controllers/controller_profile');
const { signUp, signIn } = require('./controllers/controller_auth');
const { quizzes, startQuiz, logicQuiz, logicQuiz_saveResults, resultsQuiz, deleteResult } = require('./controllers/controller_quizzes');


// connect to the DataBase
initDatabase();

const routes = [
    { path: '/sign-up', controller: signUp, method: 'post' },
    { path: '/sign-in', controller: signIn, method: 'post' },

    { path: '/profile/create-quiz', controller: profile_CreateQuiz, method: 'post' },
    { path: '/profile/own-quizzes', controller: getOwnQuizzes, method: 'post' },
    { path: '/profile/own-quizzes/edit/:quizId', controller: edit_OwnQuizzes, method: 'post' },
    { path: '/profile/own-quizzes/update/:quizId', controller: update_OwnQuiz, method: 'post' },
    { path: '/profile/own-quizzes/delete/:quizId', controller: delete_OwnQuiz, method: 'post' },
    { path: '/profile/own-results', controller: getOwn_results, method: 'post' },

    { path: '/quizzes', controller: quizzes, method: 'post' },
    { path: '/quizzes/start-quiz/:quizId', controller: startQuiz, method: 'post' },
    { path: '/quizzes/start-quiz/:quizId/:title', controller: logicQuiz, method: 'post' },
    { path: '/quizzes/start-quiz/:quizId/:title/save-results', controller: logicQuiz_saveResults, method: 'post' },
    { path: '/quizzes/:quizId/:userId/results', controller: resultsQuiz, method: 'post' },
    { path: '/quizzes/:quizId/:userId/delete/results', controller: deleteResult, method: 'post' },
];


// request
routes.forEach(({ path, controller, method }) => {
    app[method](path, controller);
});


// listening port
const port = 3000;
app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});