import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addChannel, renameChannel, removeChannel } from '../../features/channel/channelSlice.js';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import _ from 'lodash';

let i = 3;
const uniqueId = () => {
  const id = i;
  i += 1;
  return id;
};

const AddingForm = ({ handleHide }) => {
  const channels = useSelector((state) => state.channel.channels);
  const dispatch = useDispatch();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const channelsNames = channels.map(({ name }) => name);
  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('is-uniq', 'Должно быть уникальным', (value, context) => !channelsNames.includes(value)),
  });

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={schema}
      onSubmit={(values) => {
        handleHide();
        const id = uniqueId();
        const newChannel = { ...values, id, removable: true };
        dispatch(addChannel(newChannel));
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label visuallyHidden htmlFor="name">Имя канала</Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className="mb-2"
              isInvalid={!!errors.name}
              ref={inputRef}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" onClick={handleHide} variant="secondary" className="me-2">
                Отмениить
              </Button>
              <Button type="submit" variant="primary" className="me-2">
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

const RenamingForm = ({ handleHide, channelId }) => {
  const channels = useSelector((state) => state.channel.channels);
  const dispatch = useDispatch();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const [{ name }] = channels.filter(({ id }) => id === channelId);

  const channelsNames = channels.map(({ name }) => name);
  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('is-uniq', 'Должно быть уникальным', (value, context) => !channelsNames.includes(value)),
  });

  return (
    <Formik
      initialValues={{ name }}
      validationSchema={schema}
      onSubmit={(values) => {
        handleHide();
        const newChannel = { id: channelId, removable: true, ...values };
        dispatch(renameChannel(newChannel));
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label visuallyHidden htmlFor="name">Имя канала</Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className="mb-2"
              isInvalid={!!errors.name}
              ref={inputRef}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" onClick={handleHide} variant="secondary" className="me-2">
                Отмениить
              </Button>
              <Button type="submit" variant="primary" className="me-2">
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

const RemovingForm = ({ handleHide, channelId }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    handleHide();
    dispatch(removeChannel(channelId));
  };

  return (
    <>
      <p className="lead">Уверены?</p>
      <div className="d-flex justify-content-end">
        <Button type="button" onClick={handleHide} variant="secondary" className="me-2">
          Отмениить
        </Button>
        <Button type="button" onClick={handleRemove} variant="danger" className="me-2">
          Удалить
        </Button>
      </div>
    </>
  );
};

const getModal = (modalName, handleHide, channelId) => {
  switch (modalName) {
    case 'add':
      return {
        title: 'Добавить канал',
        modal: <AddingForm handleHide={handleHide} />,
      };
    case 'rename':
      return {
        title: 'Переименовать канал',
        modal: <RenamingForm handleHide={handleHide} channelId={channelId} />
      };
    case 'remove':
      return {
        title: 'Удалить канал',
        modal: <RemovingForm handleHide={handleHide} channelId={channelId} />,
      };
    default:
      throw new Error('Error: not such modal in ChannelModal.jsx');
  }
};

const ChannelModal = ({ channelId, modalName, showModal, handleHide }) => {
  const { title, modal } = getModal(modalName, handleHide, channelId);

  return (
    <Modal centered show={showModal} onHide={handleHide}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modal}
      </Modal.Body>
    </Modal>
  );
};

export default ChannelModal;
