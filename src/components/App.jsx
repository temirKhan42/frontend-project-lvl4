import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import authContext from '../context/index.jsx';
import useAuth from '../hooks/index.jsx';

import LoginPage from './LoginPage.jsx';
import HomePage from './homepage/HomePage.jsx';
import ErrorPage from './ErrorPage.jsx';
import SignupPage from './SignupPage.jsx';

import { useDispatch } from "react-redux";
import {
  addChannel,
  removeChannel,
  renameChannel,
  addMessage,
} from "../slices/chatSlice.js";

import { ToastContainer } from 'react-toastify';

const AuthProvider = ({ socket, children }) => {
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
    <authContext.Provider value={{ loggedIn, logIn, logOut, socket }}>
      {children}
    </authContext.Provider>
  );
};

const Nav = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const history = useHistory();
  const handleClick = () => {
    console.log('App Nav Handle Click On Link');
    history.push('/');
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" onClick={handleClick} href="/">Hexlet Chat</a>
        {auth.loggedIn ? (
          <button
            type="button"
            onClick={auth.logOut}
            className="btn btn-primary"
          >
            {t('navbar.logout')}
          </button>
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

export default function App({ socket }) {
  const dispatch = useDispatch();

  socket.on('newMessage', (newMessage) => {
    console.log('Socket On New Message in App.jsx');
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
    <AuthProvider socket={socket}>
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
            <Route path="/signup">
              <SignupPage />
            </Route>
            <Route path="*">
              <ErrorPage />
            </Route>
          </Switch>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}
