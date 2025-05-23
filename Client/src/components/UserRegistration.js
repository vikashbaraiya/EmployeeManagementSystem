import React, { useState, useEffect } from 'react';
import './user.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap imported
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Functional component to generate option elements
const Options = ({ options }) => {
  return (
    options.map(option => (
      <option key={option.id} value={option.id}>{option.name}</option>
    ))
  );
};


function UserForm({ items, setItems }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({ id: null, first_name: '', last_name: '', email: '', username:'',password:'', password2:'', dob: '', address:'', gender:'', mobilenumber: '', user_type: '' });
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username:'',
    password:'',
    password2:'',
    dob: '',
    address:'',
    gender:'',
    mobilenumber: '',
    user_type: ''
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const path = '/account/userlist/' 
        const response = await axios.get(path); // Replace with your actual API endpoint
        setRoleOptions(response.data.preload_data);
        console.log('pred>>', response.data.preload_data)
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
          const path = `/account/user/retrive/${id}/`
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
          const response = await axios.put(`/account/user/update/${formData.id}/`, formData, {
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
          const response = await axios.post('/account/register/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, first_name: '', last_name: '', email: '',username:'', dob: '',gender:'', address:'', password:'', password2:'', mobilenumber: '', user_type: '' });
          setInputErrors({
            email: '',
            username:'',
            first_name: '',
            last_name: '',
            dob: '',
            gender:'',
            address:'',
            password:'',
            password2:'',
            mobilenumber: '',
            user_type:'',
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
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
      isValid = false;
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
      isValid = false;
    }
    if (!formData.dob.trim()) {
      errors.dob = 'DOB is required';
      isValid = false;
    }
    if (!formData.mobilenumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobilenumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
      isValid = false;
    }
    // if (!formData.college_ID.trim()) {
    //   errors.college_ID = 'College is required';
    //   isValid = false;
    // }
    if (!formData.password.trim()) {
      errors.password = 'password is required';
      isValid = false;
    }
    if (!formData.password2.trim()) {
      errors.password2 = 'password 2 is required';
      isValid = false;
    }
    if (!formData.user_type.trim()) {
      errors.user_type = 'role is required';
      isValid = false;
    }
    if (!formData.gender.trim()) {
      errors.gender = 'gender is required';
      isValid = false;
    }
    if (!formData.username.trim()) {
      errors.username = 'username is required';
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
                name="first_name"
                className="name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {inputErrors.first_name && <div className="text-danger">{inputErrors.first_name}</div>}
            </div>
            <div className="col">
              <i className="fa fa-user icon"></i>
              <input
                placeholder="Enter Last Name"
                name="last_name"
                className="name"
                value={formData.last_name}
                onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
            />
            {inputErrors.email && <div className="text-danger">{inputErrors.email}</div>}
          </div>

          <div className="input-name mb-3">
            <i className="fa fa-envelope icon"></i>
            <input
              type="text"
              className="text-name"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {inputErrors.username && <div className="text-danger">{inputErrors.username}</div>}
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
              <i className="fa fa-lock icon"></i>
              <input
                type="password"
                className="name1"
                placeholder="Confirm password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
              />
              {inputErrors.password2 && <div className="text-danger">{inputErrors.password2}</div>}
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
              {inputErrors.gender && <div className="text-danger">{inputErrors.gender}</div>}
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

          <div className="input-name row mt-3">
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
            <div className="col">
              <i className="fa-solid fa-mobile icon" style={{fontSize:'21px', width:'25px'}}></i>
              <input
                type="text"
                className="name1"
                placeholder="Enter Mobile No."
                name="mobilenumber"
                value={formData.mobilenumber}
                onChange={handleChange}
              />
              {inputErrors.mobilenumber && <div className="text-danger">{inputErrors.mobilenumber}</div>}
            </div>
          </div>
          <div className="input-name">
            <label htmlFor="role" style={{ color: 'black', marginRight: '350px' }}>Role Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="role" name="user_type" value={formData.user_type} onChange={handleChange}>
                <option value="">Select Role</option>
                <Options options={roleOptions} />
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

export default UserForm;