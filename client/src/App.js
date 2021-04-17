import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Lobby from './pages/Lobby.jsx'
import Register from './pages/Register.jsx'
import Play from './pages/Play.jsx'
import Login from './pages/Login.jsx'
import Room from './pages/Room.jsx'

function App() {
  return (
    <Router>
      <div>

        <nav className="navbar navbar-expand-lg ">
          <div className="container-fluid">
              <Link to='/'  className=" m-2"> 
                <span className="logo">
                  Home
                </span>
              </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav mx-3">
                <Link to='/login' className="m-2"> 
                  <span>
                    Login
                  </span>
                </Link>
                <Link to='/register' className="m-2"> 
                  <span>
                    Register
                  </span>
                </Link>
                <Link to='/room' className="m-2"> 
                  <span>
                    Room
                  </span>
                </Link>
                <Link to='/Play' className="m-2"> 
                  <span>
                    Play
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/room">
            <Room />
          </Route>
          <Route path="/play">
            <Play />
          </Route>
          <Route path="/">
            <Lobby />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
