import React, { useState } from 'react';
import api from '../../api';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='authForm'>
      <h2>Login</h2>
      {error && <p className='error-message'>{error}</p>}
      <div>
        <label htmlFor="login-username">Username:</label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
