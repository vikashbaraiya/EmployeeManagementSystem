import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './user.css'



function Marksheet({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, rollNumber: '', name: '', physics: '',chemistry: '', maths: ''});
  const [inputErrors, setInputErrors] = useState({
    rollNumber: '',
    name: '',
    physics: '',
    chemistry: '',
    maths: '',
   
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/marksheet/retreive/${id}/`
          const response = await axios.get(path);
          setFormData(response.data.data);
          console.log('marksheet data...', response.data)
        } catch (error) {
          setApiError('Failed to load marksheet data. Please try again.');
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
          const response = await axios.put(`/SCM/marksheet/update/${formData.id}/`, formData, {
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
          const response = await axios.post('/SCM/marksheet/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, rollNumber: '', name: '', physics: '', chemistry: '', maths: '' });
          setInputErrors({
            rollNumber: '',
            name: '',
            physics: '',
            chemistry: '',
            maths: '',

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

   
    if (!formData.rollNumber.trim()) {
      errors.rollNumber = 'roll Number is required';
      isValid = false;
    }
    if (!formData.name.trim()) {
      errors.name = 'name is required';
      isValid = false;
    }
    if (!formData.physics.trim()) {
      errors.physics = 'physics marks is required';
      isValid = false;
    }
    
    if (!formData.chemistry.trim()) {
      errors.chemistry = 'chemistry marks is required';
      isValid = false;
    }
    if (!formData.maths.trim()) {
        errors.maths = 'maths marks is required';
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
            <input type="text" value={formData.rollNumber} onChange={handleChange} placeholder="Enter Role Number" name="rollNumber" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.rollNumber && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.rollNumber}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-city icon" style={{fontSize:'21px'}}></i>
            <input type="text" value={formData.name} onChange={handleChange} placeholder="Enter Your Name" name="name" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.name && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.name}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-flag-usa icon"></i>
            <input type="text" value={formData.physics} onChange={handleChange} placeholder="Enter Physics Marks" name="physics" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.physics && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.physics}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-address-book icon"></i>
            <input type="text" value={formData.chemistry} onChange={handleChange} placeholder="Enter Chemistry Marks" name="chemistry" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.chemistry && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.chemistry}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-mobile icon"></i>
            <input type="text" value={formData.maths} onChange={handleChange} placeholder="Enter Maths Number" name="maths" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.maths && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.maths}</div>}
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

export default Marksheet;