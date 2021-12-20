import React from "react";
import App from "./components/App.jsx";
import store from "./store/index.js";
import { Provider } from "react-redux";
import "./i18n.js";
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

const StartApp = ({ socket }) => {
  const rollbarConfig = {
    accessToken: 'cf96e5d807e5492fb9377e245ab7ebc3',  // 'POST_CLIENT_ITEM_ACCESS_TOKEN'   
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    }
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <App socket={socket} />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default StartApp;
