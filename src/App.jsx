import React from "react";
import Login from './Login.jsx';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation
} from "react-router-dom";

function Home() {
  return (
    <div>
      <h3>Home</h3>
    </div>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        404 - no <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </>
    </Router>
  );
}
