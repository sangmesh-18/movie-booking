import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to import your CSS

const API = 'http://localhost:5000';

export default function LoginPage({ setToken }) {
  const [authForm, setAuthForm] = useState({ username: '', password: '', isLogin: true });

  const handleAuth = async () => {
    const { username, password, isLogin } = authForm;
    const url = `${API}/${isLogin ? 'login' : 'register'}`;
    try {
      const res = await axios.post(url, { username, password });
      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        alert('Registered successfully');
      }
    } catch {
      alert('Auth failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h2>{authForm.isLogin ? 'Login' : 'Register'}</h2>
        <input
          className="login-input"
          placeholder="Username"
          value={authForm.username}
          onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={authForm.password}
          onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
        />
        <button className="login-btn" onClick={handleAuth}>
          {authForm.isLogin ? 'Login' : 'Register'}
        </button>
        <p className="login-toggle" onClick={() => setAuthForm({ ...authForm, isLogin: !authForm.isLogin })}>
          {authForm.isLogin ? 'No account? Register' : 'Already registered? Login'}
        </p>
      </div>
    </div>
  );
}
