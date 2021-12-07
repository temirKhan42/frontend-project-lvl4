import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../features/channel/channelSlice.js';
import { fetchChannels } from '../../features/channel/channelSlice.js';
import classNames from 'classnames';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import ChannelModal from '../modals/ChannelModal.jsx';

const AddChannel = () => {
  const [showAddChannel, setShowAddChannel] = useState(false);

  const handleShow = () => setShowAddChannel(true);
  const handleHide = () => setShowAddChannel(false);

  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button onClick={handleShow} type="button" className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>

      <ChannelModal modalName="add" showModal={showAddChannel} handleHide={handleHide} />
    </>
  );
};

const RemovableChannel = ({ name, id, btnClasses, btnSecondary }) => {
  const dropdownBtnClasses = classNames('flex-grow-0 dropdown-toggle dropdown-toggle-split btn', {
    ...btnSecondary,
  });

  const dispatch = useDispatch();
  const handleBtnClick = () => {
    dispatch(setCurrentChannel(id));
  };

  const [showModalRename, setShowModalRename] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

  const handleShowRenaming = () => setShowModalRename(true);
  const handleHideRenaming = () => setShowModalRename(false);
  const handleShowRemoving = () => setShowModalRemove(true);
  const handleHideRemoving = () => setShowModalRemove(false);

  return (
    <>
      <li className="nav-item w-100">
        <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
          <Button variant="" onClick={handleBtnClick} className={btnClasses}>
            <span className="me-1">#</span>
            {name}
          </Button>

          <Dropdown.Toggle
            split
            variant=""
            className={dropdownBtnClasses}
            id="dropdown-split-basic"
          />

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShowRemoving} href="#/action-1">
              Удалить
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShowRenaming} href="#/action-2">
              Переименовать
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>

      <ChannelModal
        modalName="rename"
        showModal={showModalRename}
        handleHide={handleHideRenaming}
        channelId={id}
      />
      <ChannelModal
        modalName="remove"
        showModal={showModalRemove}
        handleHide={handleHideRemoving}
        channelId={id}
      />
    </>
  );
};

const UnremovableChannel = ({ name, id, btnClasses }) => {
  const dispatch = useDispatch();
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(setCurrentChannel(id));
  };

  return (
    <li className="nav-item w-100">
      <button type="button" onClick={handleClick} className={btnClasses}>
        <span className="me-1">#</span>
        {name}
      </button>
    </li>
  );
}

const ChannelList = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channel);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChannels());
  }, []);

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {channels.map(({ id, name, removable }) => {
        const btnSecondary = { 'btn-secondary': id === currentChannelId };
        const btnClasses = classNames('w-100 rounded-0 text-start btn', {
          'text-truncate': removable,
          ...btnSecondary,
        });

        return (removable ?
          <RemovableChannel
            key={`${id}-${name}`}
            name={name}
            id={id}
            btnClasses={btnClasses}
            btnSecondary={btnSecondary}
          /> :
          <UnremovableChannel key={`${id}-${name}`} name={name} id={id} btnClasses={btnClasses} />
        );
      })}
    </ul>
  );
};

const Channels = () => (
  <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
    <AddChannel />
    <ChannelList />
  </div>
);

export default Channels;
