import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './user.css'
import './Registration.css'

// Functional component to generate option elements
const Options1 = ({ options }) => {
  return (
    options.map(option => (
      <option key={option.id} value={option.id}>{option.courseName}</option>
    ))
  );
};
// Functional component to generate option elements
const Options2 = ({ options }) => {
    return (
      options.map(option => (
        <option key={option.id} value={option.id}>{option.subjectName}</option>
      ))
    );
  };

function TimeTable({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({ id: null, examTime: '', examDate: '', course_ID: '', subject_ID:'', semester:'' });
  const [courseOption, setCourseOptions] = useState([]);
  const [subjectOption, setSubjectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState({
    examTime: '',
    examDate: '',
    course_ID: '',
    subject_ID:'',
    semester:''
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const path = '/SCM/timetable' 
        const response = await axios.get(path); // Replace with your actual API endpoint
        setCourseOptions(response.data.courseList);
        setSubjectOptions(response.data.subjectList);
        console.log('pred>>', response.data.subjectList)
        setLoading(false);
      } catch (error) {
        setApiError('Failed to load Time Table options. Please try again.');
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const path = `/SCM/timetable/retreive/${id}/`
          const response = await axios.get(path);
          setFormData(response.data.data);
          console.log('subject data...', response.data)
        } catch (error) {
          setApiError('Failed to load Time Table data. Please try again.');
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
            
          const path = `/SCM/timetable/update/${formData.id}/`
          const response = await axios.put(path, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => prevItems.map(item => item.id === formData.id ? response.data : item));
          setSuccessMessage('Update successful');
          navigate('/timetablelist');
        } catch (error) {
          setApiError('Update failed. Please try again.');
          console.error('Error:', error);
        }
      } else {
        try {
          const response = await axios.post('/SCM/timetable/', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setItems((prevItems) => [...prevItems, response.data]);
          setSuccessMessage('Registration successful');
          setFormData({ id: null, examTime: '',examDate: '', course_ID: '', subject_ID:'', semester:'' });
          setInputErrors({
            examTime: '',
            examDate: '',
            course_ID: '',
            subject_ID:'',
            semester:''
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

    
    if (!formData.examTime.trim()) {
      errors.examTime = 'Exam Time is required';
      isValid = false;
    }
    if (!formData.examDate.trim()) {
      errors.examDate = 'Exam Date is required';
      isValid = false;
    }
    if (!formData.course_ID.courseName.trim()) {
      errors.course_ID = 'Course Name is required';
      isValid = false;
    }
    if (!formData.subject_ID.subjectName.trim()) {
        errors.subject_ID = 'Subject Name is required';
        isValid = false;
      }
      if (!formData.semester.trim()) {
        errors.semester = 'Subject Name is required';
        isValid = false;
      }
    
    setInputErrors(errors);
    console.log(errors)
    return isValid;
  };

  return (
    <div className="container1" style={{marginTop:'-205px'}}>
      <h2>Time Table</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{ color: 'red', textAlign: 'center' }}>{apiError}</div>}
          {successMessage && <div style={{ color: 'green', textAlign: 'center' }}>{successMessage}</div>}
          <div className="input-name">
            <label htmlFor="examTime" style={{ color: 'black', marginRight: '320px' }}>Exam Time<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="examTime" value={formData.examTime} onChange={handleChange}>
                <option value="">Select Exam Time</option>
                <option value={1}>7:00 AM To 11:00 AM</option>
                <option value={2}>11:00 AM To 2:00 PM</option>
                <option value={3}>2:00 PM To 5:00 PM</option>
              </select>
            )}
          </div>
          <div className="input-name">
            <i className="fa fa-envelope icon"></i>
            <input type="date" value={formData.examDate} onChange={handleChange} placeholder="dd-mm-yyyy" name="examDate" className="text-name" />
          </div>
          <div className="input-name">
            {inputErrors.examDate && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '-10px', marginBottom: '10px' }}>{inputErrors.examDate}</div>}
          </div>
          
          <div className="input-name">
            <label htmlFor="course_ID" style={{ color: 'black', marginRight: '320px' }}>Course Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="course_ID" value={formData.course_ID.courseName} onChange={handleChange}>
                <option value="">Select Course</option>
                <Options1 options={courseOption} />
              </select>
            )}
          </div>
          <div className="input-name">
            <label htmlFor="subject_ID" style={{ color: 'black', marginRight: '320px' }}>Course Name<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="subject_ID" value={formData.subject_ID.subjectName} onChange={handleChange}>
                <option value="">Select Subject</option>
                <Options2 options={subjectOption} />
              </select>
            )}
          </div>
          <div className="input-name">
            <label htmlFor="semester" style={{ color: 'black', marginRight: '320px' }}>Semester<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <select className="text-name" name="semester" value={formData.semester} onChange={handleChange}>
                <option value="">Select Semester</option>
                <option value={1}>First Semester</option>
                <option value={2}>Second Semester</option>
                <option value={3}>Third Semester</option>
                <option value={4}>Forth Semester</option>
                <option value={5}>Fifth Semester</option>
                <option value={6}>Six Semester</option>
                <option value={7}>Seventh Semester</option>
                <option value={8}>Eight Semester</option>
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

export default TimeTable;