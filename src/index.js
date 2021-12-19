// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import { injectStyle } from "react-toastify/dist/inject-style.js";
import startApp from './startApp.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

injectStyle();
startApp();

console.log('it works!');
