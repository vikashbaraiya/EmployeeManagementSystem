import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css';

function SendPasswordResetLink() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email:'' });
  const [inputErrors, setInputErrors] = useState({
    email: '',
    
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setApiError('Token not found. Please login again.');
            return;
        };
        console.log('to',token)
        const path = 'account/send-reset-password-email/'
        const response = await axios.post(path, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`
          },
        });
        setApiError(response.data)
        setSuccessMessage('Password changed successfully');
        setFormData({ email: '' });
        setInputErrors({
          email: '',
        });
        setApiError('');
        navigate('/login'); // Redirect to login after password change
      } catch (error) {
        setApiError('Password reset link send failed. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'email is required';
      isValid = false;
    }
    
    setInputErrors(errors);
    console.log(errors);
    return isValid;
  };

  return (
    <div className="container1" style={{ marginTop: '-180px' }}>
      <h2>Change Password</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
          {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
          <div className="input-name">
            <i className="fa-solid fa-lock icon"></i>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              name="email"
              className="text-name"
            />
          </div>
          {inputErrors.email && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>
              {inputErrors.email}
            </div>
          )}
          <div className="input-button">
            <div className="row">
              <button type="submit" className="button">Send</button>
              <button style={{ marginLeft: '30px' }} type="reset" className="button-1">Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendPasswordResetLink;