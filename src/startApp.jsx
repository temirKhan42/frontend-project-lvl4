import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import store from "./store/index.js";
import { Provider } from "react-redux";
import "./i18n.js";
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '893e040092a4437c8fd6aea77735d269',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

const startApp = () => {
  ReactDOM.render(
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>,
    document.getElementById("chat")
  );
};

export default startApp;
