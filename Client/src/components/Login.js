import React, { useState } from 'react';
// import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {  Link } from 'react-router-dom';

import AuthUser from './AuthUser';


import './Login.css'



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setToken} = AuthUser();

  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: '',
  });
  
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();




  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    // const url = 'http://127.0.0.1:8000'
    const path = '/auth/login'
    // const fullPath = url + path
    if (isValid) {
      try {
        const response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frame-Allow-Origin':'sameorigin'
          },

          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("data", data)
        if (!response.ok) {
          if (data && data.errors) {
            setApiError(data.errors.non_field_errors);
            console.log(data.errors, "response not ok")
            
          } else {
            console.log(data.error, "response not ok throw")
            // throw new Error('Login failed. Please check your credentials.');
            setApiError(data.error);
          }
        } else {
          setSuccessMessage('Login successful');
          // Store token in local storage
          // localStorage.setItem('token',JSON.stringify(data.token));
          // localStorage.setItem( 'data',JSON.stringify(data));
          console.log('token1:', data);
          setToken(data.data,data.access_token);
          // Reset form fields and errors on successful submission
          setEmail('');
          setPassword('');
          setInputErrors({
            email: '',
            password: '',
          });
          setApiError('');
          
          // redirect('/welcome');
          navigate("/welcome");
         

        }
      } catch (error) {
        setApiError('An error occurred. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } 
    // else if (password.length < 6) {
    //   errors.password = 'Password must be at least 6 characters';
    //   isValid = false;
    // }

    setInputErrors(errors);
    return isValid;
  };

  return (
  <div className='conta'>
    <div className="center">
      <h1>Login</h1>
      {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
      {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className='txt_field'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span></span>
          <label htmlFor="email">Email:</label>
          {inputErrors.email && <div style={{ color: 'red', fontSize: '0.8rem' }}>{inputErrors.email}</div>}
        </div>
        <div className='txt_field'>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span></span>
          <label htmlFor="password">Password:</label>
          {inputErrors.password && <div style={{ color: 'red', fontSize: '0.8rem' }}>{inputErrors.password}</div>}
        </div>
        <input type="submit" value="Login" />
        <div className="signup_link">
          Not a member? <Link to='/registration'>Signup</Link>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Login;
