import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './user.css'
import './Registration.css'

// Functional component to generate option elements
const Options = ({ options }) => {
  return (
    options.map(option => (
      <option key={option.id} value={option.id}>{option.courseName}</option>
    ))
  );
};

function Subject({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, subjectName: '', subjectDescription: '', course_ID: '' });
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    subjectName: '',
    subjectDescription: '',
    course_ID: '',
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const path = '/SCM/subject' 
        const response = await axios.get(path); // Replace with your actual API endpoint
        setCollegeOptions(response.data.preload_data);
        console.log('pred>>', response.data.preload_data)
        setLoading(false);
      } catch (error) {
        setApiError('Failed to load subject options. Please try again.');
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/subject/retreive/${id}/`
          const response = await axios.get(path);
          setFormData(response.data.data);
          console.log('subject data...', response.data)
        } catch (error) {
          setApiError('Failed to load subject data. Please try again.');
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
          const response = await axios.put(`/SCM/subject/update/${formData.id}/`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => prevItems.map(item => item.id === formData.id ? response.data : item));
          setSuccessMessage('Update successful');
          navigate('/subjectlist');
        } catch (error) {
          setApiError('Update failed. Please try again.');
          console.error('Error:', error);
        }
      } else {
        try {
          const response = await axios.post('/SCM/subject/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, subjectName: '',subjectDescription: '', course_ID: '' });
          setInputErrors({
            subjectName: '',
            subjectDescription: '',
            course_ID: ''
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

    
    if (!formData.subjectName.trim()) {
      errors.subjectName = 'Subject Name is required';
      isValid = false;
    }
    if (!formData.subjectDescription.trim()) {
      errors.subjectDescription = 'Subject Description is required';
      isValid = false;
    }
    if (!formData.course_ID.trim()) {
      errors.course_ID = 'Course Name is required';
      isValid = false;
    }
    
    setInputErrors(errors);
    console.log(errors)
    return isValid;
  };

  return (
    <div className="container1" style={{marginTop:'-150px'}}>
      <h2>Student</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
          {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
          <div className="input-name">
            <i className="fa fa-envelope icon"></i>
            <input type="text" value={formData.subjectName} onChange={handleChange} placeholder="Enter Subject Name" name="subjectName" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.subjectName && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.subjectName}</div>}
          </div>
          <div className="input-name">
            <i className="fa fa-envelope icon"></i>
            <input type="text" value={formData.subjectDescription} onChange={handleChange} placeholder="Enter Subject Description" name="subjectDescription" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.subjectDescription && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.subjectDescription}</div>}
          </div>
          
          <div className="input-name">
            <label htmlFor="course_ID" style={{ color: 'black', marginRight: '320px' }}>Course Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="course_ID" value={formData.course_ID.courseName} onChange={handleChange}>
                <option value="">Select Course</option>
                <Options options={collegeOptions} />
              </select>
            )}
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

export default Subject;