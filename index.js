// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import './assets/application.scss';
import { injectStyle } from "react-toastify/dist/inject-style.js";
import StartApp from './src/StartApp.jsx';

const init = () => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  injectStyle();
  return StartApp;
}

export default init;
