import React, { useState } from "react";
import Channels from "./Channels.jsx";
import Messages from "./Messages.jsx";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row" aria-hidden={isModalOpen}>
        <Channels setIsModalOpen={setIsModalOpen} />
        <Messages />
      </div>
    </div>
  );
};

export default HomePage;
