import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Form, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { addMessage } from '../../features/channel/channelSlice.js';

const schema = Yup.object().shape({
  body: Yup.string().required('Обязательное поле'),
});

const MessageBox = () => {
  const { currentChannelId, messages } = useSelector((state) => state.channel);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {messages
        .filter(({ channelId }) => channelId === currentChannelId)
        .map(({ channelId, id, username, body }) => (
          <div key={`${channelId}-${id}`} className="text-break mb-2">
            <b>{username}</b>: {body}
          </div>
        ))
      }
    </div>
  );
};

const MessageForm = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });

  return (
    <Formik
      initialValues={{ body: '' }}
      validationShema={schema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addMessage(values));
        resetForm({ values: '' });
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
      }) => (
        <div className="mt-auto px-5 py-3">
          <Form noValidate onSubmit={handleSubmit}>
            <InputGroup className="has-validation">
              <Form.Control
                name="body"
                id="body"
                aria-label="Новое сообщение"
                placeholder="Введите сообщение..."
                onChange={handleChange}
                value={values.body}
                isInvalid={!!errors.body}
                ref={inputRef}
              />
              <div className="input-group-append">
                <ButtonGroup
                  as="button"
                  type="submit"
                  className="btn"
                  vertical
                  disabled={values.body === ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                  </svg>
                  <span className="visually-hidden">
                    Отправить
                  </span>
                </ButtonGroup>
              </div>
            </InputGroup>
          </Form>
        </div>
      )}
    </Formik>
  );
};

const Messages = () => {
  const { channels, currentChannelId, messages } = useSelector((state) => state.channel);

  const [{ name: channelName }] = channels.length === 0 ?
    [{ name: '' }] :
    channels.filter((channel) => channel.id === currentChannelId);

  const messageNum = messages.reduce((i, { channelId }) => {
    if (channelId === currentChannelId) {
      i += 1;
    }
    return i;
  }, 0);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {channelName}</b>
          </p>
          <span className="text-muted">
            {messageNum} сообщений
          </span>
        </div>
        <MessageBox />
        <MessageForm />
      </div>
    </div>
  );
};

export default Messages;
