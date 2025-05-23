import { Routes, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Error404  from './Error404';
// import Home from './components/home';
import Login from '../components/Login';
import Registration from '../components/Registration';
import './Guest.css'
function Guest() {
    return (
        <>
            <nav className="navbar navbar-expand navbar-dark">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">   
                        <Link className="nav-link" to="/registration">Register</Link>
                    </li>

                </ul>

            </nav>
            <div className="container">
                <Routes>
                    <Route path="/fdgdfg" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="*" element={<Error404 />} />
                    
                </Routes>
            </div>
        </>
    );
}

export default Guest;