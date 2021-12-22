// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import './assets/application.scss';
import { injectStyle } from 'react-toastify/dist/inject-style.js';
import React from 'react';
import StartApp from './src/StartApp.jsx';

const init = (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  injectStyle();
  return <StartApp socket={socket} />;
};

export default init;
