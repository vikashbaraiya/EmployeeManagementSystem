// import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";

import React from 'react';
import './App.css';

// import { Routes, Route } from 'react-router-dom';
import AuthUser from './components/AuthUser';
import Guest from './components/Guest';
import Header from './components/Header';
function App() {
  
  

           
  const {getToken} = AuthUser();
  if(!getToken()){
    return <Guest />
  }
  return (
      <Header />
  );
  
}

export default App;
