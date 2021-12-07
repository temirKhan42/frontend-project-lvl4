import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import store from "./store/index.js";
import { Provider } from "react-redux";

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("chat")
  );
};

export default startApp;
