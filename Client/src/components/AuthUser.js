import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthUser(){
    const navigate = useNavigate();

    const getToken = () =>{
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log('usertoken', userToken)
        return userToken;
    }

    const getUser = () =>{
        const userString = sessionStorage.getItem('user');
        const user_detail = JSON.parse(userString);
        console.log("user data..",user_detail)
        return user_detail;
    }



    const [token,setToken] = useState(getToken());
    const [user,setUser] = useState(getUser());

    const saveToken = (user,token) =>{
        sessionStorage.setItem('token',JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate('/welcome');
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    }

    const http = axios.create({
        baseURL:"http://localhost:8000/login/",
        headers:{
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}