import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Nav from './components/Nav';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import Profile from './components/Profile';
import Home from './components/Home';

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('email'));

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        setLoggedIn(false);
    };

    return (
        <div className="">
            <Router>
                <Nav loggedIn={loggedIn} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={loggedIn ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <Signup onSignup={handleLogin} />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    {/* Protect these routes */}
                    <Route path="/change_password" element={loggedIn ? <ChangePassword /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
