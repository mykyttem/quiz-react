import './css/App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import SignUp from './sign_up';
import SignIn from './sign_in';

import Profile from './profile';
import CreateQuiz from './create_quiz';


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
                <a href="/services" className="nav-link">Services</a>
              </li>
              <li className="nav-item">
                <a href="/contact" className="nav-link">Contact</a>
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

         
            <Route path='/sign-up' component={ SignUp } />
            <Route path='/sign-in' component={ SignIn } />

            <Route exact path='/profile' component={Profile} />
            <Route path='/profile/create-quiz' component={CreateQuiz} />
          </nav>
      </div>
    </BrowserRouter>
  );
}


export default App;