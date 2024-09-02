import React, { useState } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OrderList from './components/Order/OrderList';
import './app.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [showLogin, setShowLogin] = useState(true);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleRegister = () => {
        setShowLogin(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (isAuthenticated) {
        return (
            <div className="App">
                <h1>Automotive Repair Shop</h1>
                <button className='log-btn' onClick={handleLogout}>Logout</button>
                <OrderList />
            </div>
        );
    }

    return (
        <div className="App">
            <h1>Automotive Repair Shop</h1>
            <div>
                <button className='log-btn' onClick={() => setShowLogin(true)}>Login</button>
                <button className='log-btn' onClick={() => setShowLogin(false)}>Register</button>
            </div>
            {showLogin ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Register onRegister={handleRegister} />
            )}
        </div>
    );
}

export default App;
