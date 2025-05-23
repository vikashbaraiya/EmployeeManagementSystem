import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Correct import statement
import { Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Error404 from './Error404';
import Sidebar from './sidebar';
import './Header.css';
import UserDataTable from './UserList';
import StudentList from './StudentList';
import AuthUser from '../components/AuthUser';
import Student from '../components/Student'
import UserForm from './UserRegistration'
import Welcome from './Welcome';
import College from './College';
import CollegeList from './CollegeList';
import CourseList from './CourseList';
import Course from './Course';
import MarksheetList from './MarksheetList';
import Marksheet from './Marksheet';
import Subject from './Subject';
import SubjectList from './SubjectList';
import FacultyForm from './Faculty';
import FacultyDataTable from './FacultyList'
import TimeTable from './TimeTable';
import TimeTableDataTable from './TimeTableList';
import ChangePassword from './ChangePassword';
import SendPasswordResetLink from './PasswordResetLinkSend';
import ResetPassword from './ResetPassword';

function Header() {

  const {user, token, logout } = AuthUser();
  console.log("header user",user.roles[0]); // Check the user value
  const logoutUser = () => {
    console.log(token); // Check the token value
    
    if ( token !== null ) {
      logout();
    }
  }
  const [showInput, setShowInput] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [items, setItems] = useState([]);
  return (
    <>
      <div className="navbar-container">
        <nav>
          <div className="navbar">
            <i className={`bx bx-menu ${isSidebarOpen ? 'sidebar-open' : ''}`} onClick={toggleSidebar}></i>
            <div className="logo"><a href="/csd">SMS</a></div>
            <div className={`nav-links ${isSidebarOpen ? 'sidebar-open' : ''}`}>
              <div className="sidebar-logo">
                <span className="logo-name">SMS</span>
                <i className="bx bx-x" onClick={toggleSidebar}></i>
              </div>
              <ul className="links">
                <li><Link to="/sdsd">HOME</Link></li>
                <li className="nav-item">
                        <span role="button" className="nav-link" onClick={logoutUser} style={{color:'white'}}>LOGOUT</span>
                    </li>
                {/* Add your other navigation links */}
              </ul>
            </div>
            <div className="search-box">
              <i className={`bx ${showInput ? 'bx-x' : 'bx-search'}`} onClick={toggleInput}></i>
              {showInput && (
                <div className="input-box">
                  <input type="text" placeholder="Search..." value={'vv'}></input>
                </div>
              )}
            </div>
            <span className='context' style={{marginRight:'-100px'}}>
            <h4 style={{color:'yellow'}}> {user ? user.roles[0] : 'Guest'}</h4>
            </span>


          </div>
        </nav>
        <div className="sidebar-container">
        <Sidebar isOpen={isSidebarOpen} />
        </div>
      
      </div>
      <div className="head-container">
                <Routes>
                    {/* <Route path="/registration" element={<Registration />} /> */}
                    <Route path="*" element={<Error404 />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/user/registration" element={<UserForm items={items} setItems={setItems}/>} />
                    <Route path="/user/update/:id" element={<UserForm items={items} setItems={setItems}/>} />
                    <Route path="/changepassword" element={<ChangePassword />} />
                    <Route path="/passwordresetlinksend" element={<SendPasswordResetLink />} />
                    <Route path="/passwordreset/:uid/:token" element={<ResetPassword />} />
                    <Route path="/userlist" element={<UserDataTable />} />
                    <Route path="/studentlist" element={<StudentList />} />
                    <Route path="/collegelist" element={<CollegeList />} />
                    <Route path="/courselist" element={<CourseList />} />
                    <Route path="/marksheetlist" element={<MarksheetList />} />
                    <Route path="/subjectlist" element={<SubjectList />} />
                    <Route path="/facultylist" element={<FacultyDataTable />} />
                    <Route path="/timetablelist" element={<TimeTableDataTable />} />
                    <Route path="/student/add" element={<Student items={items} setItems={setItems}/>} />
                    <Route path="/student/update/:id" element={<Student items={items} setItems={setItems}/>} />
                    <Route path="/college/add" element={<College items={items} setItems={setItems}/>} />
                    <Route path="/college/update/:id" element={<College items={items} setItems={setItems}/>} />
                    <Route path="/course/add" element={<Course items={items} setItems={setItems}/>} />
                    <Route path="/course/update/:id" element={<Course items={items} setItems={setItems}/>} />
                    <Route path="/marksheet/add" element={<Marksheet items={items} setItems={setItems}/>} />
                    <Route path="/marksheet/update/:id" element={<Marksheet items={items} setItems={setItems}/>} />
                    <Route path="/subject/add" element={<Subject items={items} setItems={setItems}/>} />
                    <Route path="/subject/update/:id" element={<Subject items={items} setItems={setItems}/>} />
                    <Route path="/faculty/add" element={<FacultyForm items={items} setItems={setItems}/>} />
                    <Route path="/faculty/update/:id" element={<FacultyForm items={items} setItems={setItems}/>} />
                    <Route path="/timetable/add" element={<TimeTable items={items} setItems={setItems}/>} />
                    <Route path="/timetable/update/:id" element={<TimeTable items={items} setItems={setItems}/>} />
                    


                </Routes>
      </div>
      
    </>
  );
}

export default Header;