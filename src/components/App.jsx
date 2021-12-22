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

import { ToastContainer, toast } from 'react-toastify';
import { useImmer } from 'use-immer';

const AuthProvider = ({ socket, children }) => {
  const userId = localStorage.getItem('userId');

  const [loggedIn, setLoggedIn] = useState(!!userId);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const [modals, updateModals] = useImmer({
    addChannel: 'close',    // 'close', 'open'
    removeChannel: 'close',
    renameChannel: 'close',
  });

  return (
    <authContext.Provider value={{
      loggedIn,
      logIn,
      logOut,
      socket,
      modals,
      updateModals,
    }}>
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
        <a className="navbar-brand" href="/" onClick={handleClick}>Hexlet Chat</a>
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
  console.log("From Private Route After click on Hexlet Chat");
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

  const { t } = useTranslation();
  const notifyChannelCreated = () => toast.success(t('notes.channel created'));
  const notifyChannelRenamed = () => toast.success(t('notes.channel renamed'));
  const notifyChannelRemoved = () => toast.success(t('notes.channel removed'));

  socket.on('newMessage', (newMessage) => {
    dispatch(addMessage(newMessage));
  });

  socket.on('newChannel', (channelWithId) => {
    dispatch(addChannel(channelWithId));
    notifyChannelCreated();
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(removeChannel(id));
    notifyChannelRemoved();
  });

  socket.on('renameChannel', (newChannel) => {
    dispatch(renameChannel(newChannel));
    notifyChannelRenamed();
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
