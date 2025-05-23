import React, { useState } from 'react';
import './Registration.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap imported

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password2, setConfirmPassword] = useState('');
 

  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    password2: '',
    
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    const path = 'auth/register';
    if (isValid) {
      try {
        const response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frame-Allow-Origin': 'sameorigin'
          },
          body: JSON.stringify({ email, password, first_name, last_name }),
        });

        const data = await response.json();
        if (!response.ok) {
          if (data && data.error) {
            setApiError(data.error);
            console.log(data.error, "response not ok");
          } else {
            throw new Error('Registration failed. Please try again.');
          }
        } else {
          setSuccessMessage('Registration successful');
          // Reset form fields and errors on successful submission
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFirstName('');
          setLastName('');
          setInputErrors({
            email: '',
            username: '',
            password: '',
            first_name: '',
            last_name: '',
          });
          setApiError('');
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
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!first_name.trim()) {
      errors.first_name = 'First name is required';
      isValid = false;
    }
    if (!last_name.trim()) {
      errors.last_name = 'Last name is required';
      isValid = false;
    }
    
    if (!password2.trim()) {
      errors.password2 = 'Confirm Password is required';
      isValid = false;
    }
    
    setInputErrors(errors);
    return isValid;
  };

  return (
    <div className="container1" style={{marginTop:'50px'}}>
      <h2>User Registration</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
          {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
          
          <div className="input-name row mb-3">
            <div className="col">
              <i className="fa fa-user icon"></i>
              <input
                placeholder="Enter First Name"
                name="firstName"
                className="name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {inputErrors.first_name && <div className="text-danger">{inputErrors.first_name}</div>}
            </div>
            <div className="col">
              <i className="fa fa-user icon"></i>
              <input
                placeholder="Enter Last Name"
                name="lastName"
                className="name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
              {inputErrors.last_name && <div className="text-danger">{inputErrors.last_name}</div>}
            </div>
          </div>

          <div className="input-name mb-3">
            <i className="fa fa-envelope icon"></i>
            <input
              type="email"
              className="text-name"
              placeholder="Enter your Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {inputErrors.email && <div className="text-danger">{inputErrors.email}</div>}
          </div>

  

          <div className="input-name row mb-3">
            <div className="col">
              <i className="fa fa-lock icon"></i>
              <input
                type="password"
                className="name1"
                placeholder="Enter Your Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {inputErrors.password && <div className="text-danger">{inputErrors.password}</div>}
            </div>
            <div className="col">
              <i className="fa fa-lock icon"></i>
              <input
                type="password"
                className="name1"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {inputErrors.password2 && <div className="text-danger">{inputErrors.password2}</div>}
            </div>
          </div>

          {/* <div className="input-name1 row mb-3">
            <div className="col">
              <div className="radio-button form-check-inline">
                <input
                  className="radio-button"
                  type="radio"
                  name="gender"
                  value="M"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === 'M'}
                />
                <label className="form-check-label">Male</label>
              </div>
              <div className="radio-button form-check-inline">
                <input
                  className="radio-button"
                  type="radio"
                  name="gender"
                  value="F"
                  onChange={(e) => setGender(e.target.value)}
                  checked={gender === 'F'}
                />
                <label className="form-check-label" style={{paddingRight:'20px', paddingLeft:'10px'}}>Female</label>
              </div>
              {inputErrors.gender && <div className="text-danger">{inputErrors.gender}</div>}
            </div>
            <div className="col">
              <i className="fa fa-calendar icon"></i>
              <input
                type="date"
                className="name1"
                placeholder="dd-mm-yyyy"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {inputErrors.dob && <div className="text-danger">{inputErrors.dob}</div>}
            </div>
          </div>

          <div className="input-name row mt-3">
            <div className="col">
              <i className="fa fa-address-book icon" aria-hidden="true" style={{fontSize:'22px', width:'30px'}}></i>
              <input
                type="text"
                className="name1"
                placeholder="Enter Your Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {inputErrors.address && <div className="text-danger">{inputErrors.address}</div>}
            </div>
            <div className="col">
              <i className="fa-solid fa-mobile icon" style={{fontSize:'21px', width:'25px'}}></i>
              <input
                type="text"
                className="name1"
                placeholder="Enter Mobile No."
                name="mobilenumber"
                value={mobilenumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              {inputErrors.mobilenumber && <div className="text-danger">{inputErrors.mobilenumber}</div>}
            </div>
          </div> */}

          <div className="input-button d-flex justify-content-between">
            <button type="submit" className="button">Save</button>
            <button type="reset" className="button-1">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;