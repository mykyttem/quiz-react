import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './home';

import SignUp from './auth/sign_up';
import SignIn from './auth/sign_in';

import Profile from './profile/profile';
import CreateQuiz from './profile/create_quiz';
import OwnQuizzes from './profile/own_quizzes';
import EditOwnQuizzes from './profile/edit_own_quizzes';
import OwnResult from './profile/own_results';

import Quizzes from './quiz/quizzes';
import StartQuiz from './quiz/start_quiz';
import LogicQuiz from './quiz/logic_quiz';
import ResultsQuiz from './quiz/results_quiz';


function Page_notFound() {
  return (
    <div className="container">
      <h1 className="title">Page not found</h1>
      <p className="text">
        Sorry, the page you are looking for does not exist
      </p>
      <button className="button" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <div className="App">      
          <nav>
            <ul className="navbar">
              <li className="nav-item">
                <a href="/" className="nav-link">Home</a>
              </li>
              <li className="nav-item">
                <a href="/about" className="nav-link">About</a>
              </li>
              <li className="nav-item">
                <a href="/quizzes" className="nav-link">Quizzes</a>
              </li>
              <li className="nav-item">
                <a href="/sign-up" className="nav-link">Sign Up</a>
              </li>

              <li className="nav-item">
                <a href="/sign-in" className="nav-link">Sign In</a>
              </li>

              <li className="nav-item">
                <a href="/profile" className="nav-link">Profile</a>
              </li>
            </ul>


            <Switch>
              <Route exact path='/' component={ Home } />
          
              <Route path='/sign-up' component={ SignUp } />
              <Route path='/sign-in' component={ SignIn } />

              <Route exact path='/profile' component={Profile} />
              <Route path='/profile/create-quiz' component={CreateQuiz} />
              <Route exact path='/profile/own-quizzes' component={OwnQuizzes} />
              <Route path='/profile/own-quizzes/edit/:quizId' component={EditOwnQuizzes} />
              <Route path='/profile/own-results' component={OwnResult} />

              <Route exact path='/quizzes' component={Quizzes} />
              <Route exact path='/quizzes/start-quiz/:quizId' component={StartQuiz} />
              <Route path='/quizzes/start-quiz/:quizId/:title' component={LogicQuiz} />
              <Route path='/quizzes/:quizId/:userId/results' component={ResultsQuiz}/>

              <Route component={Page_notFound} />
            </Switch>
          </nav>
      </div>
    </BrowserRouter>
  );
}


export default App;