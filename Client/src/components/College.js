import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './user.css'



function College({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, collegeName: '', collegeAddress: '', collegeState: '',collegeCity: '', collegePhoneNumber: ''});
  const [inputErrors, setInputErrors] = useState({
    collegeName: '',
    collegeAddress: '',
    collegeState: '',
    collegeCity: '',
    collegePhoneNumber: '',
   
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/college/retreive/${id}/`
          const response = await axios.get(path);
          setFormData(response.data.data);
          console.log('student data...', response.data)
        } catch (error) {
          setApiError('Failed to load student data. Please try again.');
        }
      };

      fetchStudent();
    }
  }, [id, isEditMode]);

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
      if (isEditMode) {
        try {
          const response = await axios.put(`/SCM/college/update/${formData.id}/`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => prevItems.map(item => item.id === formData.id ? response.data : item));
          setSuccessMessage('Update successful');
          navigate('/');
        } catch (error) {
          setApiError('Update failed. Please try again.');
          console.error('Error:', error);
        }
      } else {
        try {
          const response = await axios.post('/SCM/college/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, collegeName: '', collegeAddress: '', collegeCity: '', collegeState: '', collegePhoneNumber: '' });
          setInputErrors({
            collegeName: '',
            collegeCity: '',
            collegeState: '',
            collegeAddress: '',
            collegePhoneNumber: '',

          });
          setApiError('');
        } catch (error) {
          setApiError('Registration failed. Please try again.');
          console.error('Error:', error);
        }
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // if (!formData.email.trim()) {
    //   errors.email = 'Email is required';
    //   isValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   errors.email = 'Email is invalid';
    //   isValid = false;
    // }
    if (!formData.collegeName.trim()) {
      errors.collegeName = 'College name is required';
      isValid = false;
    }
    if (!formData.collegeCity.trim()) {
      errors.collegeCity = 'Collge City is required';
      isValid = false;
    }
    if (!formData.collegeState.trim()) {
      errors.collegeState = 'Collge State is required';
      isValid = false;
    }
    if (!formData.collegePhoneNumber.trim()) {
      errors.collegePhoneNumber = 'College Phone Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.collegePhoneNumber)) {
      errors.collegePhoneNumber = 'Phone number must be 10 digits';
      isValid = false;
    }
    if (!formData.collegeAddress.trim()) {
      errors.collegeAddress = 'College Address is required';
      isValid = false;
    }

    setInputErrors(errors);
    console.log(errors)
    return isValid;
  };

  return (
    <div className="container1" style={{marginTop:'-180px'}}>
      <h2>College</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
          {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
          <div className="input-name">
            <i className="fa-solid fa-building-columns icon"></i>
            <input type="text" value={formData.collegeName} onChange={handleChange} placeholder="Enter College Name" name="collegeName" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.collegeName && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.collegeName}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-city icon" style={{fontSize:'21px'}}></i>
            <input type="text" value={formData.collegeCity} onChange={handleChange} placeholder="Enter College City" name="collegeCity" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.collegeCity && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.collegeCity}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-flag-usa icon"></i>
            <input type="text" value={formData.collegeState} onChange={handleChange} placeholder="Enter College State" name="collegeState" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.collegeState && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.collegeState}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-address-book icon"></i>
            <input type="text" value={formData.collegeAddress} onChange={handleChange} placeholder="Enter College Address" name="collegeAddress" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.collegeAddress && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.collegeAddress}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-mobile icon"></i>
            <input type="text" value={formData.collegePhoneNumber} onChange={handleChange} placeholder="Enter College Phone Number" name="collegePhoneNumber" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.collegePhoneNumber && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.collegePhoneNumber}</div>}
          </div>
          <div className="input-button">
            <div className="row">
              <button type="submit" className="button">{isEditMode ? 'Update' : 'Add'}</button>
              <button style={{marginLeft:'30px'}} type="reset" className="button-1">Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default College;