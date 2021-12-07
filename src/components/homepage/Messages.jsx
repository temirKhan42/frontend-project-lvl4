import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Form, InputGroup, ButtonGroup } from 'react-bootstrap';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  body: Yup.string().required('Обязательное поле'),
});

const MessageBox = () => {
  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      <div className="text-break mb-2">
        <b>admin</b>: abcdefg
      </div>
    </div>
  );
};

const MessageForm = () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });

  return (
    <Formik
      initialValues={{ body: '' }}
      validationShema={schema}
      onSubmit={(values) => {
        console.log(values)
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
            <InputGroup>
              <Form.Control
                name="body"
                id="body"
                aria-label="Новое сообщение"
                placeholder="Введите сообщение..."
                className="border-0 p-0 ps-2"
                onChange={handleChange}
                value={values.body}
                isInvalid={!!errors.body}
                ref={inputRef}
              />
              <ButtonGroup type="submit" vertical disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visualy-hidden">
                  Отправить
                </span>
              </ButtonGroup>
            </InputGroup>
          </Form>
        </div>
      )}
    </Formik>
    // <div className="mt-auto px-5 py-3">
    //   <form noValidate className="py-1 border rounded-2">
    //     <div className="input-group has-validation">
    //       <input ref={inputRef} name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2 form-control" value="" />
    //       <div className="input-group-append">
    //         <button type="submit" className="btn btn-group-vertical" disabled>
    //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
    //             <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z">
    //             </path>
    //           </svg>
    //           <span className="visually-hidden">
    //             Отправить
    //           </span>
    //         </button>
    //       </div>
    //     </div>
    //   </form>
    // </div>
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
