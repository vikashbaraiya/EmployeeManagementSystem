import React, { useState, useEffect } from 'react';
import './user.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap imported
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Functional component to generate option elements
const CollegeOptions = ({ options }) => {
  return (
    options.map(option => (
      <option key={option.id} value={option.id}>{option.collegeName}</option>
    ))
  );
};
const CourseOptions = ({ options }) => {
    return (
      options.map(option => (
        <option key={option.id} value={option.id}>{option.courseName}</option>
      ))
    );
  };
  const SubjectOptions = ({ options }) => {
    return (
      options.map(option => (
        <option key={option.id} value={option.id}>{option.subjectName}</option>
      ))
    );
  };


function FacultyForm({ items, setItems }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({ id: null, firstName: '', lastName: '', email: '',password:'', dob: '', address:'', gender:'', college_ID: '', subject_ID: '', course_ID:'' });
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password:'',
    dob: '',
    address:'',
    gender:'',
    college_ID: '',
    subject_ID: '',
    course_ID:''
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const path = '/SCM/faculty/' 
        const college_response = await axios.get(path); // Replace with your actual API endpoint
        setCollegeOptions(college_response.data.collegeList);
        const course_response = await axios.get(path); // Replace with your actual API endpoint
        setCourseOptions(course_response.data.courseList)
        const subject_response = await axios.get(path); // Replace with your actual API endpoint
        setSubjectOptions(subject_response.data.subjectList)
        console.log('pred>>', course_response.data.collegeList)
        setLoading(false);
      } catch (error) {
        setApiError('Failed to load faculty options. Please try again.');
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/faculty/retreive/${id}/`
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
          const response = await axios.put(`/account/faculty/update/${formData.id}/`, formData, {
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
          const response = await axios.post('/account/faculty/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, firstName: '', lastName: '', email: '', dob: '',gender:'', address:'', password:'', college_ID:'', course_ID: '', subject_ID: '' });
          setInputErrors({
            email: '',
            firstName: '',
            lastName: '',
            dob: '',
            gender:'',
            address:'',
            password:'',
            course_ID:'',
            college_ID: '',
            subject_ID:'',
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
    // if (!formData.mobilenumber.trim()) {
    //   errors.mobileNumber = 'Mobile Number is required';
    //   isValid = false;
    // } else if (!/^\d{10}$/.test(formData.mobilenumber)) {
    //   errors.mobileNumber = 'Mobile number must be 10 digits';
    //   isValid = false;
    // }
    // if (!formData.college_ID.trim()) {
    //   errors.college_ID = 'College is required';
    //   isValid = false;
    // }
    if (!formData.password.trim()) {
      errors.password = 'password is required';
      isValid = false;
    }
    if (!formData.course_ID.trim()) {
      errors.course_ID = 'Course Name is required';
      isValid = false;
    }
    if (!formData.college_ID.trim()) {
      errors.college_ID = 'College Id is required';
      isValid = false;
    }
    if (!formData.gender.trim()) {
      errors.gender = 'gender is required';
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = 'address is required';
      isValid = false;
    }
    setInputErrors(errors);
    console.log(errors)
    return isValid;
  };
  return (
    <div className="container1">
      <h2>Faculty Registration</h2>
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

          <div className="input-name mb-3">
            <i className="fa fa-envelope icon"></i>
            <input
              type="email"
              className="text-name"
              placeholder="Enter your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
              />
              {inputErrors.password && <div className="text-danger">{inputErrors.password}</div>}
            </div>
            <div className="col">
              <i className="fa fa-address-book icon" aria-hidden="true" style={{fontSize:'22px', width:'30px'}}></i>
              <input
                type="text"
                className="name1"
                placeholder="Enter Your Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {inputErrors.address && <div className="text-danger">{inputErrors.address}</div>}
            </div>
          </div>

          <div className="input-name1 row mb-3">
            <div className="col">
              <div className="radio-button form-check-inline">
                <input
                  className="radio-button"
                  type="radio"
                  name="gender"
                  value="M"
                  onChange={handleChange}
                  checked={formData.gender === 'M'}
                />
                <label className="form-check-label">Male</label>
              </div>
              <div className="radio-button form-check-inline">
                <input
                  className="radio-button"
                  type="radio"
                  name="gender"
                  value="F"
                  onChange={handleChange}
                  checked={formData.gender === 'F'}
                />
                <label className="form-check-label" style={{paddingRight:'20px', paddingLeft:'10px'}}>Female</label>
              </div>
              {inputErrors.gender && <div className="text-danger" style={{marginTop:'-20px'}}>{inputErrors.gender}</div>}
            </div>
            <div className="col">
              <i className="fa fa-calendar icon"></i>
              <input
                type="date"
                className="name1"
                placeholder="dd-mm-yyyy"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {inputErrors.dob && <div className="text-danger">{inputErrors.dob}</div>}
            </div>
          </div>
          <div className="input-name">
            {/* <label htmlFor="role" style={{ color: 'black', marginRight: '350px' }}>College Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label> */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="role" name="college_ID" value={formData.college_ID} onChange={handleChange}>
                <option value="">Select College</option>
                <CollegeOptions options={collegeOptions} />
              </select>
            )}
          </div>
          <div className="input-name">
            {/* <label htmlFor="role" style={{ color: 'black', marginRight: '350px' }}>Course Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label> */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="role" name="user_type" value={formData.course_ID} onChange={handleChange}>
                <option value="">Select Course</option>
                <CourseOptions options={courseOptions} />
              </select>
            )}
          </div>
          <div className="input-name">
            {/* <label htmlFor="role" style={{ color: 'black', marginRight: '350px' }}>Subject Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label> */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="role" name="subject_ID" value={formData.subject_ID} onChange={handleChange}>
                <option value="">Select Subject</option>
                <SubjectOptions options={subjectOptions} />
              </select>
            )}
          </div>

          <div className="input-button d-flex justify-content-between">
          <button type="submit" className="button">{isEditMode ? 'Update' : 'Save'}</button>
            <button type="reset" className="button-1">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyForm;