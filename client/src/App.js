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
import Navbar from './components/Navbar'
import LoginRegister from './pages/LoginRegister'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/lobby">
          <Lobby />
        </Route>
        <Route path="/room/:name">
          <Navbar />
          <Room />
        </Route>
        <Route path="/play/:name">
          <Navbar />
          <Play />
        </Route>
        <Route exact path="/">
          <LoginRegister />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
