import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/layout/Dashboard';
import Profiles from './components/layout/Profiles';


const App = () => {
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  useEffect(()=>{
    const u = localStorage.getItem("user");
    u && JSON.parse(u) ? setUser(true) : setUser(false);
  },[]);
  useEffect(()=>{
    localStorage.setItem("user",user);
  },[user]);
  return (
    <Router>
      <Fragment>
        <Navbar />
        
        <section className='container'>
          <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/profiles' element={<Profiles/>}/>
            {!newUser && (
              <Route path='/register' element={<Register authenticate={()=>setNewUser(true)}/>} />
            )}

            {!user && (
              <Route path='/login' element={<Login authenticate={() => setUser(true)} />} />
            )}
            {user && (
              <Route path='/dashboard' element={<Dashboard />} />
            )}
            <Route path='*' element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
