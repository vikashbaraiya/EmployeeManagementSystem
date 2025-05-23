
import './Sidebar.css'
// import $ from 'jquery';
import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import AuthUser from '../components/AuthUser';

function Sidebar() {
//   const [visible, setVisible] = useState(false)
const [activeSubMenu, setActiveSubMenu] = useState(null);

const handleSubMenuClick = (index) => {
    setActiveSubMenu(prevActiveSubMenu => (prevActiveSubMenu === index ? null : index));
  };

  const { token, logout } = AuthUser();

  const logoutUser = () => {
    console.log(token); // Check the token value
    
    if ( token !== null ) {
      logout();
    }
  }

  return (
    <>
    <aside className="sidebar">
  <div id="leftside-navigation" className="nano">
    <ul className="nano-content">
      <li>
        <Link to="index.html"><i className="fa fa-dashboard"></i><span>Dashboard</span></Link>
      </li>
      <li>
        <Link to="index.html"><i className="fa fa-dashboard"></i><span>Profile</span></Link>
      </li>
      <li id="sub-menu" className={activeSubMenu === 2 ? 'active' : ''}>
        <Link to="/javascript" onClick={() => handleSubMenuClick(2)}><i className="fa fa-table"></i><span>Tables</span><i className="arrow fa fa-angle-right pull-right"></i></Link>
        <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
          <li><Link to="/userlist">User Table</Link>
          </li>
          <li><Link to="/studentlist">Student Table</Link>
          </li>
          <li><Link to="/collegelist">College Tables</Link>
          </li>
          <li><Link to="/courselist">Course Tables</Link>
          </li>
          <li><Link to="/marksheetlist">Marksheet Tables</Link>
          </li>
          <li><Link to="/subjectlist">Subject Tables</Link>
          </li>
          <li><Link to="/facultylist">Faculty Tables</Link>
          </li>
          <li><Link to="/timetablelist">Time  Tables</Link>
          </li>
        </ul>
      </li>
      <li id="sub-menu" className={activeSubMenu === 3 ? 'active' : ''}>
        <Link to="javascript" onClick={() => handleSubMenuClick(3)}><i className="fa fa fa-tasks"></i><span>Forms</span><i className="arrow fa fa-angle-right pull-right"></i></Link>
        <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
          <li><Link to="/user/registration">User</Link>
          </li>
          <li><Link to="/student/add">Student</Link>
          </li>
          <li><Link to="/college/add">College</Link>
          </li>
          <li><Link to="/course/add">Course</Link>
          </li>
          <li><Link to="/subject/add">Subject</Link>
          </li>
          <li><Link to="/faculty/add">Faculty</Link>
          </li>
          <li><Link to="/timetable/add">Time Table</Link>
          </li>
        </ul>
      </li>
      <li id="sub-menu " className={activeSubMenu === 4 ? 'active' : ''}>
        <Link to="javascriptsd" onClick={() => handleSubMenuClick(4)}><i className="fa fa-envelope"></i><span>Mail</span><i className="arrow fa fa-angle-right pull-right"></i></Link>
        <ul style={{ display: activeSubMenu === 4 ? 'block' : 'none' }}>
          <li ><Link to="mail-inbox.html">Inbox</Link>
          </li>
          <li><Link to="mail-compose.html">Compose Mail</Link>
          </li>
        </ul>
      </li>
      <li id="sub-menu"  className={activeSubMenu === 5 ? 'active' : ''}>
        <Link to="javascri" onClick={() => handleSubMenuClick(5)}><i className="fa fa-lock"></i><span>Password</span><i className="arrow fa fa-angle-right pull-right"></i></Link>
        <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }}>
          <li>
              <Link to="/changepassword"><i className="fa fa-lock "></i><span>password change</span></Link>
          </li>
          <li>
              <Link to="/passwordresetlinksend"><i className="fa fa-lock"></i><span>password reset send</span></Link>
          </li>
           <li>
           <Link to="/passwordreset/:uid/:token"><i className="fa fa-lock"></i><span>password reset</span></Link>
          </li>
        </ul>
      </li>
      
      
      <li>
      <span role="button" className="nav-link" onClick={logoutUser}>Logout</span>
      </li>
    </ul>
  </div>
</aside>
 </>
  

  );
}


export default Sidebar;