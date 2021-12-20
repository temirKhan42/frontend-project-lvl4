import React from "react";
import App from "./components/App.jsx";
import store from "./store/index.js";
import { Provider } from "react-redux";
import "./i18n.js";
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import socketContext from './context/socketContext.jsx';

const StartApp = ({ socket }) => {
  const rollbarConfig = {
    accessToken: 'cf96e5d807e5492fb9377e245ab7ebc3',  // 'POST_CLIENT_ITEM_ACCESS_TOKEN'   
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    }
  };

  const SocketProvider = ({ children }) => (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <SocketProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </SocketProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default StartApp;
