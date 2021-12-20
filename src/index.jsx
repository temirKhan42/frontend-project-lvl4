// @ts-check
import React from "react";
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import { injectStyle } from "react-toastify/dist/inject-style.js";
import ReactDOM from "react-dom";
import StartApp from './StartApp.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

injectStyle();
ReactDOM.render(
  <StartApp />,
  document.getElementById('chat')
);

console.log('it works!');
