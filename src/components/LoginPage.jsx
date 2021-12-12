import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import routes from '../routes.js';
import useAuth from "../hooks/index.jsx";
import loginImage from "../../assets/login-image.js";

const LoginForm = () => {
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
        const { data } = await axios.post(routes.loginPath(), option);
        setAuthFailed(false);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.logIn();
        history.push('/');
      } catch (err) {
        setAuthFailed(true);
        console.log(err);
      }
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">Войти</h1>
      <Form.Group>
        <FloatingLabel className="mb-3" label="Ваш ник">
          <Form.Control
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            className="form-control"
            placeholder="Ваш ник"
            required
            ref={inputRef}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            isInvalid={authFailed}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group>
        <FloatingLabel className="mb-4" label="Пароль">
          <Form.Control
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Пароль"
            className="form-control"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            isInvalid={authFailed}
          />
          <Form.Control.Feedback type="invalid" tooltip>
            Неверные имя пользователя или пароль
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Button as="input" className="w-100 mb-3 btn" variant="outline-primary" type="submit" value="Войти" />
    </Form>
  );
};

const CardBody = ({ children }) => (
  <div className="card-body row p-5">
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
      <img src={loginImage} className="rounded-circle" alt="Войти" />
    </div>
    {children}
  </div>
);

const Footer = () => (
  <div className="card-footer p-4">
    <div className="text-center">
      <span>Нет акаунта?</span>
      <a href="/signup"> Регистрация</a>
    </div>
  </div>
);

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
