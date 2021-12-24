import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { setCurrentChannel, fetchChannels } from '../../slices/chatSlice.js';
import { openModal, closeModal } from '../../slices/uiSlice.js';
import ChannelModal from '../modals/ChannelModal.jsx';

const AddChannel = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'homePage' });

  const dispatch = useDispatch();

  const [showAddChannel, setShowAddChannel] = useState(false);

  const modalName = 'addChannel';

  const handleShowAdding = () => {
    setShowAddChannel(true);
    dispatch(openModal(modalName));
  };
  const handleHideAdding = () => {
    setShowAddChannel(false);
    dispatch(closeModal(modalName));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channel list')}</span>
        <button
          onClick={handleShowAdding}
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>

      <ChannelModal
        modalName={modalName}
        showModal={showAddChannel}
        handleHide={handleHideAdding}
      />
    </>
  );
};

const RemovableChannel = ({
  name, id, btnClasses, btnSecondary,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'homePage' });

  const dispatch = useDispatch();

  const drpdnBtnClss = 'flex-grow-0 dropdown-toggle dropdown-toggle-split btn';
  const dropdownBtnClasses = classNames(drpdnBtnClss, { ...btnSecondary });

  const handleBtnClick = () => {
    dispatch(setCurrentChannel(id));
  };

  const [showModalRename, setShowModalRename] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

  const renameModalName = 'renameChannel';
  const removeModalName = 'removeChannel';

  const handleShowRenaming = () => {
    setShowModalRename(true);
    dispatch(openModal(renameModalName));
  };
  const handleHideRenaming = () => {
    setShowModalRename(false);
    dispatch(closeModal(renameModalName));
  };
  const handleShowRemoving = () => {
    setShowModalRemove(true);
    dispatch(openModal(removeModalName));
  };
  const handleHideRemoving = () => {
    setShowModalRemove(false);
    dispatch(closeModal(removeModalName));
  };

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
          >
            <span className="visually-hidden">{t('channel control')}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShowRemoving} href="#">
              {t('removing channel modal button')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShowRenaming} href="#">
              {t('renaming channel modal button')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>

      <ChannelModal
        modalName={renameModalName}
        showModal={showModalRename}
        handleHide={handleHideRenaming}
        channelId={id}
      />
      <ChannelModal
        modalName={removeModalName}
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
};

const ChannelList = () => {
  const { channels, currentChannelId } = useSelector((state) => state.chat);
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

        return (removable
          ? (
            <RemovableChannel
              key={`${id}-${name}`}
              name={name}
              id={id}
              btnClasses={btnClasses}
              btnSecondary={btnSecondary}
            />
          )
          : (
            <UnremovableChannel
              key={`${id}-${name}`}
              name={name}
              id={id}
              btnClasses={btnClasses}
            />
          )
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
