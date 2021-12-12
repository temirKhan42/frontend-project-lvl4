import React, { useState, useEffect, useRef } from "react";
import image from '../../assets/signup-image.js';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import routes from '../routes.js';
import axios from "axios";
import useAuth from '../hooks/index.jsx';
import { useHistory } from "react-router-dom";

const SignupForm = () => {
  const auth = useAuth();
  const history = useHistory();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });

  const [authUniqFailed, setAuthUniqFailed] = useState(false);

  const schema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .required('Обязательное поле')
      .min(6, 'Не менее 6 символов'),
    confirmPassword: Yup.string()
      .required('Обязательное поле')
      .test('is-match', 'Пароли должны совпадать', (val, { parent }) => val === parent.password)
      .test('is-uniq', 'Такой пользователь уже существует', () => {
        return !authUniqFailed;
      }),
  });

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await axios.post(routes.signupPath(), values);
        setAuthUniqFailed(false);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.logIn();
        resetForm({ values: '' });
        history.push('/');
      } catch (err) {
        if (err.message === 'Request failed with status code 409') {
          setAuthUniqFailed(true);
          console.log(err);
        }
      }
    },
  });

  return (
    <Form noValidate className="w-50" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">Регистрация</h1>
      <FloatingLabel label="Имя пользователя" className="mb-3 form-group">
        <Form.Control
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          placeholder="От 3 до 20 символов"
          value={formik.values.username}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.username}
          disabled={formik.isSubmitting}
          ref={inputRef}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.username}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel label="Пароль" className="mb-3 form-group">
        <Form.Control
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Не менее 6 символов"
          value={formik.values.password}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.password}
          disabled={formik.isSubmitting}
          required
          aria-describedby="passwordHelpBlock"
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.password}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel label="Подтвердить пароль" className="mb-4 form-group">
        <Form.Control
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Пароли должны совпадать"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.confirmPassword}
          disabled={formik.isSubmitting}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.confirmPassword}
        </Form.Control.Feedback>
      </FloatingLabel>
      <Button
        type="submit"
        disabled={formik.isSubmitting}
        variant="outline-primary"
        className="w-100"
      >
        Зарегистрироваться
      </Button>
    </Form>
  );

  // return (
  //   <Formik
  //     initialValues={initialValues}
  //     validationSchema={schema}
  //     onSubmit={async (values, { resetForm }) => {
  //       try {
  //         const { data } = await axios.post(routes.signupPath(), values);
  //         setAuthUniqFailed(false);
  //         localStorage.setItem('userId', JSON.stringify(data));
  //         auth.logIn();
  //         resetForm({ values: '' });
  //         history.push('/');
  //       } catch (err) {
  //         if (err.message === 'Request failed with status code 409') {
  //           setAuthUniqFailed(true);
  //           console.log(err);
  //         }
  //       }
  //     }}
  //   >
  //     {({
  //       handleSubmit,
  //       handleChange,
  //       values,
  //       errors,
  //       isSubmitting,
  //     }) => {
  //       return (
  // <Form noValidate className="w-50" onSubmit={handleSubmit}>
  //   <h1 className="text-center mb-4">Регистрация</h1>
  //   <FloatingLabel label="Имя пользователя" className="mb-3 form-group">
  //     <Form.Control
  //       type="text"
  //       id="username"
  //       name="username"
  //       autoComplete="username"
  //       placeholder="От 3 до 20 символов"
  //       value={values.username}
  //       onChange={handleChange}
  //       isInvalid={!!errors.username}
  //       disabled={isSubmitting}
  //       ref={inputRef}
  //       required
  //     />
  //     <Form.Control.Feedback type="invalid" tooltip>
  //       {errors.username}
  //     </Form.Control.Feedback>
  //   </FloatingLabel>
  //   <FloatingLabel label="Пароль" className="mb-3 form-group">
  //     <Form.Control
  //       type="password"
  //       id="password"
  //       name="password"
  //       autoComplete="new-password"
  //       placeholder="Не менее 6 символов"
  //       value={values.password}
  //       onChange={handleChange}
  //       isInvalid={!!errors.password}
  //       disabled={isSubmitting}
  //       required
  //       aria-describedby="passwordHelpBlock"
  //     />
  //     <Form.Control.Feedback type="invalid" tooltip>
  //       {errors.password}
  //     </Form.Control.Feedback>
  //   </FloatingLabel>
  //   <FloatingLabel label="Подтвердить пароль" className="mb-4 form-group">
  //     <Form.Control
  //       type="password"
  //       id="confirmPassword"
  //       name="confirmPassword"
  //       autoComplete="new-password"
  //       placeholder="Пароли должны совпадать"
  //       value={values.confirmPassword}
  //       onChange={handleChange}
  //       isInvalid={!!errors.confirmPassword}
  //       disabled={isSubmitting}
  //       required
  //     />
  //     <Form.Control.Feedback type="invalid" tooltip>
  //       {errors.confirmPassword}
  //     </Form.Control.Feedback>
  //   </FloatingLabel>
  //   <Button
  //     type="submit"
  //     disabled={isSubmitting}
  //     variant="outline-primary"
  //     className="w-100"
  //   >
  //     Зарегистрироваться
  //   </Button>
  // </Form>
  //       )
  //     }}
  //   </Formik>
  // );
};

const SignupImage = () => {
  return (
    <div>
      <img src={image} className="rounded-circle" alt="Регистрация" />
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