import React from 'react';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import useAuth from '../../hooks/index.jsx';

const HomePage = () => {
  const auth = useAuth();

  const modalStates = Object.values(auth.modals);

  const isModalOpen = modalStates.some((state) => state === 'open');

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
