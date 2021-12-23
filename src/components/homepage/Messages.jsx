import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Form, InputGroup, ButtonGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import filter from 'leo-profanity';
import useAuth from '../../hooks/index.jsx';

const MessageBox = () => {
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const { currentChannelId, messages } = useSelector((state) => state.channel);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      {messages
        .filter(({ channelId }) => channelId === currentChannelId)
        .map(({
          channelId, id, username, text,
        }) => (
          <div key={`${channelId}-${id}`} className="text-break mb-2">
            <b>{username}</b>
            :
            {text}
          </div>
        ))}
      <div ref={divRef} />
    </div>
  );
};

const enFilter = (text) => {
  filter.loadDictionary('en');
  return filter.clean(text);
};

const ruFilter = (text) => {
  filter.loadDictionary('ru');
  return filter.clean(text);
};

const filterObsceneText = ({ text }) => ({ text: ruFilter(enFilter(text)) });

const MessageForm = () => {
  const { t } = useTranslation();
  const { currentChannelId } = useSelector((state) => state.channel);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });

  const auth = useAuth();

  const schema = Yup.object().shape({
    body: Yup.string().required(t('error messages.required')),
  });

  return (
    <Formik
      initialValues={{ text: '' }}
      validationShema={schema}
      onSubmit={(values, { resetForm }) => {
        const { text } = filterObsceneText(values);
        const { username } = JSON.parse(localStorage.getItem('userId'));
        resetForm({ values: '' });
        const newMessage = {
          channelId: currentChannelId,
          username,
          text,
        };
        auth.socket.emit('newMessage', newMessage, (res) => console.log(res));
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        isSubmitting,
      }) => (
        <div className="mt-auto px-5 py-3">
          <Form noValidate onSubmit={handleSubmit}>
            <InputGroup className="has-validation">
              <Form.Control
                name="text"
                id="text"
                aria-label={t('homePage.text message label')}
                placeholder={t('homePage.text message placeholder')}
                onChange={handleChange}
                value={values.text}
                isInvalid={!!errors.text}
                ref={inputRef}
                disabled={isSubmitting}
              />
              <div className="input-group-append">
                <ButtonGroup
                  as="button"
                  type="submit"
                  className="btn"
                  vertical
                  disabled={values.text === '' || isSubmitting}
                  role="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                  </svg>
                  <span className="visually-hidden">
                    {t('homePage.send message button')}
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
  const { t } = useTranslation('translation', { keyPrefix: 'homePage.message count' });
  const { channels, currentChannelId, messages } = useSelector((state) => state.channel);

  const [{ name: channelName }] = channels.length === 0
    ? [{ name: '' }]
    : channels.filter((channel) => channel.id === currentChannelId);

  const messageNum = messages.reduce((i, { channelId }) => {
    if (channelId === currentChannelId) {
      const result = i + 1;
      return result;
    }
    return i;
  }, 0);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {channelName}
            </b>
          </p>
          <span className="text-muted">
            {t('key', { count: messageNum })}
          </span>
        </div>
        <MessageBox />
        <MessageForm />
      </div>
    </div>
  );
};

export default Messages;
