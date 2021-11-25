import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById("chat"));
};

export default startApp;
