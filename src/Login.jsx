import React from "react";
import loginImage from "../assets/login-image.js";
import { useFormik } from 'formik';

const LoginForm = () => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">Войти</h1>
      <div className="form-floating mb-3 form-group">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className="form-control"
          placeholder="Ваш ник"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        <label htmlFor="username">Ваш ник</label>
      </div>

      <div className="form-floating mb-4 form-group">
        <input
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
        />
        <label htmlFor="password">Пароль</label>
      </div>

      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
    </form>
  );
};

const Nav = () => (
  <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <div className="container">
      <a className="navbar-brand" href="/">Hexlet Chat</a>
    </div>
  </nav>
);

const CardBody = () => (
  <div className="card-body row p-5">
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
      <img src={loginImage} className="rounded-circle" alt="Войти" />
    </div>
    <LoginForm />
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

const Login = () => (
  <div className="d-flex flex-column h-100">
    <Nav />
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <CardBody />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Login;
