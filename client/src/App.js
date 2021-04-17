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

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Navbar />
          <Login />
        </Route>
        <Route path="/register">
          <Navbar />
          <Register />
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
          <Lobby />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
