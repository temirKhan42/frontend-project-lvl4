import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import routes from '../routes.js';
import axios from "axios";
import useAuth from '../hooks/index.jsx';
import { useHistory } from "react-router-dom";
// import { useRollbar } from '@rollbar/react';
// import image from '../../assets/signup-image.js';

const getData = async (option) => {
  const { data } = await axios.post(routes.signupPath(), option);
  return data;
};

const SignupForm = () => {
  const { t } = useTranslation();

  //  const rollbar = useRollbar();

  const auth = useAuth();

  const history = useHistory();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });

  const [authUniqFailed, setAuthUniqFailed] = useState(false);

  const schema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('error messages.symbols ammount'))
      .max(20, t('error messages.symbols ammount'))
      .required(t('error messages.required')),
    password: Yup.string()
      .required(t('error messages.required'))
      .min(6, t('error messages.password symbols ammount')),
    confirmPassword: Yup.string()
      .required(t('error messages.required'))
      .test('is-match', t('error messages.confirm password'), (val, { parent }) => val === parent.password),
  });

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const customHandleChange = (handleChange) => (...args) => {
    if (authUniqFailed) setAuthUniqFailed(false);
    handleChange(...args);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const data = await getData(values);
          setAuthUniqFailed(false);
          localStorage.setItem('userId', JSON.stringify(data));
          auth.logIn();
          resetForm({ values: '' });
          history.push('/');
        } catch (err) {
          if (err.message === 'Request failed with status code 409') {
            setAuthUniqFailed(true);
            console.log(err);
            // rollbar.error('Authentication failed', err);
          }
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        isSubmitting,
      }) => {
        return (
          <Form noValidate className="w-50" onSubmit={handleSubmit}>
            <h1 className="text-center mb-4">{t('signupPage.form header')}</h1>
            <FloatingLabel
              label={t('signupPage.username label')}
              className="mb-3 form-group"
              controlId="username"
            >
              <Form.Control
                type="text"
                name="username"
                autoComplete="username"
                placeholder={t('error messages.symbols ammount')}
                value={values.username}
                onChange={customHandleChange(handleChange)}
                isInvalid={!!errors.username || authUniqFailed}
                disabled={isSubmitting}
                ref={inputRef}
                required
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.username}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              label={t('signupPage.password label')}
              className="mb-3 form-group"
              controlId="password"
            >
              <Form.Control
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder={t('error messages.password symbols ammount')}
                value={values.password}
                onChange={customHandleChange(handleChange)}
                isInvalid={!!errors.password || authUniqFailed}
                disabled={isSubmitting}
                required
                aria-describedby="passwordHelpBlock"
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.password}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              label={t('signupPage.confirm password label')}
              className="mb-4 form-group"
              controlId="confirmPassword"
            >
              <Form.Control
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t('error messages.confirm password')}
                value={values.confirmPassword}
                onChange={customHandleChange(handleChange)}
                isInvalid={!!errors.confirmPassword || authUniqFailed}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {authUniqFailed ? t('error messages.user exist') : errors.confirmPassword}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="outline-primary"
              className="w-100"
            >
              {t('signupPage.submit button')}
            </Button>
          </Form>
        )
      }}
    </Formik>
  );
};

const SignupImage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signupPage' })
  return (
    <div>
      <img src="#" className="rounded-circle" alt={t('image alt')} />
    </div>
  );
};

const SignupPage = () => {
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <SignupImage />
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
