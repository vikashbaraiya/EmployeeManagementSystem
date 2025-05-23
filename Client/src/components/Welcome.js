// import logo from './logo.svg';

// import {Login} from './components';

// import Sidebar  from './components/sidebar';
// import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import './Welcome.css'
import AuthUser from './AuthUser';

function Welcome() {
  const { user } = AuthUser();
  console.log(user, 'user')
  return (
        <div className='welcome'>
                <h4>Welcome Back  {user ? user.first_name : 'Guest'}</h4>
        </div>
  );
}

export default Welcome;
