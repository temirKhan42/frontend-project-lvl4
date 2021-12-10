import React, { useState } from "react";
import { io } from 'socket.io-client';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import authContext from '../context/index.jsx';
import useAuth from '../hooks/index.jsx';

import LoginPage from './LoginPage.jsx';
import HomePage from './homepage/HomePage.jsx';
import ErrorPage from './ErrorPage.jsx';

import { useDispatch } from "react-redux";
import {
  addChannel,
  removeChannel,
  renameChannel,
  addMessage,
} from "../features/channel/channelSlice.js";

const AuthProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const [loggedIn, setLoggedIn] = useState(!!userId);

  const logIn = () => {
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const Nav = () => {
  const auth = useAuth();
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        {auth.loggedIn ? (
          <button type="button" onClick={auth.logOut} className="btn btn-primary">Выйти</button>
        ) : ''}
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children, ...rest }) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => (auth.loggedIn ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location },
          }}
        />
      ))}
    />
  );
};

export default function App() {
  const dispatch = useDispatch();
  const socket = io();

  socket.on('newMessage', (newMessage) => {
    dispatch(addMessage(newMessage));
  });

  socket.on('newChannel', (channelWithId) => {
    dispatch(addChannel(channelWithId));
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(removeChannel(id));
  });

  socket.on('renameChannel', (newChannel) => {
    dispatch(renameChannel(newChannel));
  });

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Nav />
          <Switch>
            <PrivateRoute exact path="/">
              <HomePage />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="*">
              <ErrorPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}