import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './user.css'
import './Registration.css'

// Functional component to generate option elements
const Options = ({ options }) => {
  return (
    options.map(option => (
      <option key={option.id} value={option.id}>{option.collegeName}</option>
    ))
  );
};

function Student({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, firstName: '', lastName: '', email: '', dob: '', mobileNumber: '', college_ID: '' });
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    mobileNumber: '',
    college_ID: ''
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const path = '/SCM/student' 
        const response = await axios.get(path); // Replace with your actual API endpoint
        setCollegeOptions(response.data.preload_data);
        console.log('pred>>', response.data)
        setLoading(false);
      } catch (error) {
        setApiError('Failed to load college options. Please try again.');
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/student/retreive/${id}/`
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
          const response = await axios.put(`/SCM/student/update/${formData.id}/`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => prevItems.map(item => item.id === formData.id ? response.data : item));
          setSuccessMessage('Update successful');
          navigate('/studentlist');
        } catch (error) {
          setApiError('Update failed. Please try again.');
          console.error('Error:', error);
        }
      } else {
        try {
          const response = await axios.post('/SCM/student/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, firstName: '', lastName: '', email: '', dob: '', mobileNumber: '', college_ID: '' });
          setInputErrors({
            email: '',
            firstName: '',
            lastName: '',
            dob: '',
            mobileNumber: '',
            college_ID: ''
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

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.dob.trim()) {
      errors.dob = 'DOB is required';
      isValid = false;
    }
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
      isValid = false;
    }
    // if (!formData.college_ID.trim()) {
    //   errors.college_ID = 'College is required';
    //   isValid = false;
    // }

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
          <div className="input-name row mb-3">
            <div className="col">
              <i className="fa fa-user icon"></i>
              <input
                placeholder="Enter First Name"
                name="firstName"
                className="name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {inputErrors.firstName && <div className="text-danger">{inputErrors.firstName}</div>}
            </div>
            <div className="col">
              <i className="fa fa-user icon"></i>
              <input
                placeholder="Enter Last Name"
                name="lastName"
                className="name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {inputErrors.lastName && <div className="text-danger">{inputErrors.lastName}</div>}
            </div>
          </div>
          <div className="input-name">
            <i className="fa fa-envelope icon"></i>
            <input type="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" name="email" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.email && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.email}</div>}
          </div>
          <div className="input-name row mb-3">
            <div className="col">
              <i className="fa fa-calendar icon"></i>
              <input
                type="date"
                className="name1"
                placeholder="Enter Your DOB"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {inputErrors.dob && <div className="text-danger">{inputErrors.dob}</div>}
            </div>
            <div className="col">
              <i className="fa fa-address-book icon"></i>
              <input
                type="text"
                className="name1"
                placeholder="Enter Your Address"
                name="dob"
                value={formData.address}
                onChange={handleChange}
              />
              {inputErrors.address && <div className="text-danger">{inputErrors.address}</div>}
            </div>
          </div>
          <div className="input-name">
            <label htmlFor="college_ID" style={{ color: 'black', marginRight: '320px' }}>College Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="college_ID" value={formData.college_ID} onChange={handleChange}>
                <option value="">Select College</option>
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

export default Student;