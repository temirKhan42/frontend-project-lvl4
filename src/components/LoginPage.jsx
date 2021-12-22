import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import routes from '../routes.js';
import useAuth from "../hooks/index.jsx";
import loginImage from "../../assets/login-image.js";
import { useRollbar } from '@rollbar/react';

const getData = async (option) => {
  const { data } = await axios.post(routes.loginPath(), option);
  return data;
};

const LoginForm = () => {
  const rollbar = useRollbar();

  const { t } = useTranslation();

  const history = useHistory();

  const auth = useAuth();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const [authFailed, setAuthFailed] = useState(false);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: async (option) => {
      try {
        const data = await getData(option);
        setAuthFailed(false);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.logIn();
        history.push('/')
      } catch (err) {
        if (option.username === '' && option.password === '') {
          return;
        }
        setAuthFailed(true);
        console.log(err);
        // rollbar.error('Unauthorized user', err);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">{t('loginPage.form header')}</h1>
      <Form.Group>
        <FloatingLabel
          className="mb-3"
          label={t('loginPage.label username')}
          controlId="username"
        >
          <Form.Control
            name="username"
            type="text"
            autoComplete="username"
            placeholder={t('loginPage.label username')}
            required
            disabled={formik.isSubmitting}
            ref={inputRef}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            isInvalid={authFailed}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group>
        <FloatingLabel
          className="mb-4"
          label={t('loginPage.label password')}
          controlId="password"
        >
          <Form.Control
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder={t('loginPage.label password')}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            isInvalid={authFailed}
          />
          {
            !authFailed ? null : (
              <Form.Control.Feedback type="invalid" tooltip>
                {t('error messages.authorization failed')}
              </Form.Control.Feedback>
            )
          }
        </FloatingLabel>
      </Form.Group>
      <Button
        disabled={formik.isSubmitting}
        as="input"
        className="w-100 mb-3 btn"
        variant="outline-primary"
        type="submit"
        value={t('loginPage.submit button')}
      />
    </Form>
  );
};

const CardBody = ({ children }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  return (
    <div className="card-body row p-5">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <img src="#" className="rounded-circle" alt={t('image alt')} />
      </div>
      {children}
    </div>
  );
}

const Footer = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const history = useHistory();
  const handleClick = () => {
    history.push('/signup');
  };

  return (
    <div className="card-footer p-4">
      <div className="text-center">
        <span>{t('acaunt question')}</span>
        <a href="/signup" onClick={handleClick}>{t('signup')}</a>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <CardBody>
              <LoginForm />
            </CardBody>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
