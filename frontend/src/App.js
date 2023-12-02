import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './home';

import SignUp from './sign_up';
import SignIn from './sign_in';

import Profile from './profile';
import CreateQuiz from './create_quiz';
import OwnQuizzes from './own_quizzes';
import Quizzes from './users_quizzes';
import EditOwnQuizzes from './edit_own_quizzes';


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

              <Route path='/quizzes' component={Quizzes} />

              <Route component={Page_notFound} />
            </Switch>
          </nav>
      </div>
    </BrowserRouter>
  );
}


export default App;