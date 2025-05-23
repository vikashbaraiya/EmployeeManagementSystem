import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './user.css'



function Course({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, courseName: '', courseDescription: '', courseDuration: ''});
  const [inputErrors, setInputErrors] = useState({
    courseName: '',
    courseDescription: '',
    courseDuration: '',
  
   
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const path = `/SCM/course/retreive/${id}/`
          const response = await axios.get(path);
          setFormData(response.data.data);
          console.log('student data...', response.data)
        } catch (error) {
          setApiError('Failed to load course data. Please try again.');
        }
      };

      fetchCourse();
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
          const response = await axios.put(`/SCM/course/update/${formData.id}/`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => prevItems.map(item => item.id === formData.id ? response.data : item));
          setSuccessMessage('Update successful');
          navigate('/courselist');
        } catch (error) {
          setApiError('Update failed. Please try again.');
          console.error('Error:', error);
        }
      } else {
        try {
          const response = await axios.post('/SCM/course/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, courseName: '', courseDescription: '', courseDuration: '',  });
          setInputErrors({
            courseName: '',
            courseDescription: '',
            courseDuration: '',

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

   
    if (!formData.courseName.trim()) {
      errors.courseName = 'Course name is required';
      isValid = false;
    }
    if (!formData.courseDescription.trim()) {
      errors.courseDescription = 'Course Description is required';
      isValid = false;
    }
    if (!formData.courseDuration.trim()) {
      errors.courseDuration = 'Course Duration is required';
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
            <i className="fa-brands fa-discourse icon"></i>
            <input type="text" value={formData.courseName} onChange={handleChange} placeholder="Enter Course Name" name="courseName" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.courseName && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.courseName}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-file-prescription icon" style={{fontSize:'21px'}}></i>
            <input type="text" value={formData.courseDescription} onChange={handleChange} placeholder="Enter Course Description" name="courseDescription" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.courseDescription && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.courseDescription}</div>}
          </div>
          <div className="input-name">
            <i className="fa-solid fa-hourglass-start icon"></i>
            <input type="text" value={formData.courseDuration} onChange={handleChange} placeholder="Enter Course Duration" name="courseDuration" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.courseDuration && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.courseDuration}</div>}
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

export default Course;