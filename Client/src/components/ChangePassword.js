import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css';

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ old_password: '', password: '', password2: '' });
  const [inputErrors, setInputErrors] = useState({
    old_password: '',
    password: '',
    password2: ''
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
        const path = 'account/changepassword/'
        const response = await axios.post(path, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`
          },
        });
        setApiError(response.data)
        setSuccessMessage('Password changed successfully');
        setFormData({ old_password: '', password: '', password2: '' });
        setInputErrors({
          old_password: '',
          password: '',
          password2: '',
        });
        setApiError('');
        navigate('/login'); // Redirect to login after password change
      } catch (error) {
        setApiError('Password change failed. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.old_password.trim()) {
      errors.old_password = 'Old password is required';
      isValid = false;
    }
    if (!formData.password.trim()) {
      errors.password = 'New password is required';
      isValid = false;
    }
    if (!formData.password2.trim()) {
      errors.password2 = 'Confirm password is required';
      isValid = false;
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match';
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
              type="password"
              value={formData.old_password}
              onChange={handleChange}
              placeholder="Enter Old Password"
              name="old_password"
              className="text-name"
            />
          </div>
          {inputErrors.old_password && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>
              {inputErrors.old_password}
            </div>
          )}
          <div className="input-name">
            <i className="fa-solid fa-lock icon" style={{ fontSize: '21px' }}></i>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter New Password"
              name="password"
              className="text-name"
            />
          </div>
          {inputErrors.password && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>
              {inputErrors.password}
            </div>
          )}
          <div className="input-name">
            <i className="fa-solid fa-lock icon"></i>
            <input
              type="password"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirm New Password"
              name="password2"
              className="text-name"
            />
          </div>
          {inputErrors.password2 && (
            <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>
              {inputErrors.password2}
            </div>
          )}
          <div className="input-button">
            <div className="row">
              <button type="submit" className="button">Save</button>
              <button style={{ marginLeft: '30px' }} type="reset" className="button-1">Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;