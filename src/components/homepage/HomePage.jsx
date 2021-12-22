import React, { useState } from "react";
import Channels from "./Channels.jsx";
import Messages from "./Messages.jsx";
import useAuth from '../../hooks/index.jsx';

const HomePage = () => {
  const auth = useAuth();

  const modals = Object.entries(auth.modals);

  const isModalOpen = modals.some(([key, val]) => val === 'open');

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row" aria-hidden={isModalOpen}>
        <Channels />
        <Messages />
      </div>
    </div>
  );
};

export default HomePage;
