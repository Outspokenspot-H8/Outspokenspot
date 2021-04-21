import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";

import Lobby from './pages/Lobby.jsx'
import Play from './pages/Play.jsx'
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
          render={() => localStorage.access_token ? (<> <Navbar/> <Room/> </>) : <Redirect to="/"/> }
        />
        <Route
          path="/play/:name"
          render={() => localStorage.access_token ? (<> <Navbar/> <Play/> </>) : <Redirect to="/"/> }
        />
        <Route exact path="/">
          { localStorage.access_token ? (<Redirect to="/lobby" />)  : ( <LoginRegister/> ) }
        </Route>
        <Route path="*">
            <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

function NoMatch () {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default App;
