import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import useAuth from '../../hooks/index.jsx';

const AddingForm = ({ handleHide }) => {
  const { t } = useTranslation();

  const auth = useAuth();

  const channels = useSelector((state) => state.channel.channels);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const channelsNames = channels.map(({ name }) => name);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('error messages.symbols ammount'))
      .max(20, t('error messages.symbols ammount'))
      .required(t('error messages.required'))
      .test('is-uniq', t('error messages.uniq name'), (value) => !channelsNames.includes(value)),
  });

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={schema}
      onSubmit={(values) => {
        handleHide();
        auth.socket.emit('newChannel', values, (res) => console.log(res));
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        isSubmitting,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label visuallyHidden htmlFor="name">
              {t('homePage.modals.channel name label')}
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className="mb-2"
              isInvalid={!!errors.name}
              ref={inputRef}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" onClick={handleHide} disabled={isSubmitting} variant="secondary" className="me-2">
                {t('homePage.modals.cancel button')}
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary" className="me-2">
                {t('homePage.modals.confirm button')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

const RenamingForm = ({ handleHide, channelId }) => {
  const { t } = useTranslation();

  const auth = useAuth();

  const channels = useSelector((state) => state.channel.channels);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const [{ name: channelName }] = channels.filter(({ id }) => id === channelId);

  const channelsNames = channels.map(({ name }) => name);
  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('error messages.symbols ammount'))
      .max(20, t('error messages.symbols ammount'))
      .required(t('error messages.required'))
      .test('is-uniq', t('error messages.uniq name'), (name) => !channelsNames.includes(name)),
  });

  return (
    <Formik
      initialValues={{ name: channelName }}
      validationSchema={schema}
      onSubmit={(values) => {
        handleHide();
        auth.socket.emit('renameChannel', {
          id: channelId,
          ...values,
        }, (res) => console.log(res));
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        isSubmitting,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label visuallyHidden htmlFor="name">
              {t('homePage.modals.channel name label')}
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className="mb-2"
              isInvalid={!!errors.name}
              ref={inputRef}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" onClick={handleHide} disabled={isSubmitting} variant="secondary" className="me-2">
                {t('homePage.modals.cancel button')}
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="primary" className="me-2">
                {t('homePage.modals.confirm button')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

const RemovingForm = ({ handleHide, channelId }) => {
  const { t } = useTranslation();

  const auth = useAuth();

  const handleRemove = () => {
    handleHide();
    auth.socket.emit('removeChannel', { id: channelId }, (res) => console.log(res));
  };

  return (
    <>
      <p className="lead">{t('homePage.modals.confidence question')}</p>
      <div className="d-flex justify-content-end">
        <Button type="button" onClick={handleHide} variant="secondary" className="me-2">
          {t('homePage.modals.cancel button')}
        </Button>
        <Button type="button" onClick={handleRemove} variant="danger" className="me-2">
          {t('homePage.modals.remove channel button')}
        </Button>
      </div>
    </>
  );
};

const getModal = (modalName, handleHide, channelId, t) => {
  switch (modalName) {
    case 'add':
      return {
        title: t('add channel header'),
        modal: <AddingForm handleHide={handleHide} />,
      };
    case 'rename':
      return {
        title: t('rename channel header'),
        modal: <RenamingForm handleHide={handleHide} channelId={channelId} />,
      };
    case 'remove':
      return {
        title: t('remove channel header'),
        modal: <RemovingForm handleHide={handleHide} channelId={channelId} />,
      };
    default:
      throw new Error('Error: not such modal in ChannelModal.jsx');
  }
};

const ChannelModal = ({
  channelId, modalName, showModal, handleHide,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'homePage.modals' });

  const { title, modal } = getModal(modalName, handleHide, channelId, t);

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
