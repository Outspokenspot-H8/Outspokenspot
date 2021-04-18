import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Lobby from './pages/Lobby.jsx'
import Register from './pages/Register.jsx'
import Play from './pages/Play.jsx'
import Login from './pages/Login.jsx'
import Room from './pages/Room.jsx'
import Navbar from './components/Navbar'
import LoginRegister from './pages/LoginRegister'

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/lobby"
          render={() => localStorage.access_token ? <Lobby/> : <Redirect to="/"/> }
        />
        <Route
          path="/room/:name"
          render={() => localStorage.access_token ? <Room/> : <Redirect to="/"/> }
        />
        <Route
          path="/play/:name"
          render={() => localStorage.access_token ? <Play/> : <Redirect to="/"/> }
        />
        <Route exact path="/">
          { localStorage.access_token ? (<Redirect to="/lobby" />)  : ( <LoginRegister/> ) }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
