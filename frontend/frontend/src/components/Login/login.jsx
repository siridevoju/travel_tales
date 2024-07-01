import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const data = isLogin ? { email, password } : { username, email, password };
    try {
      const response = await axios.post(url, data);
      // Assuming the token and user data are in response.data
      const { token, userId } = response.data; // Extracting the _id from the user data
      localStorage.setItem('token', token); // Save the token in local storage
      localStorage.setItem('userId', userId); // Save the user _id in local storage
      // Save the user _id in local storage
      navigate('/');
    } catch (err) {
      const errorMsg = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'An error occurred';
      setError(errorMsg);
    }
  };

  useEffect(() => {
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');

    loginBtn.addEventListener('click', () => setIsLogin(true));
    signupBtn.addEventListener('click', () => setIsLogin(false));

    return () => {
      loginBtn.removeEventListener('click', () => setIsLogin(true));
      signupBtn.removeEventListener('click', () => setIsLogin(false));
    };
  }, []);

  return (
    <div className="form-structor">
      <div className={`signup ${isLogin ? 'slide-up' : ''}`}>
        <h2 className="form-title" id="signup" onClick={() => setIsLogin(false)}>
          <span>or</span>Sign up
        </h2>
        <div className="form-holder">
          <form onSubmit={onSubmit}>
            {!isLogin && (
              <input
                type="text"
                className="input"
                placeholder="Username"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
            )}
            <input
              type="email"
              className="input"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
            <button className="submit-btn" type="submit">
              {isLogin ? 'Log in' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
      <div className={`login ${isLogin ? '' : 'slide-up'}`}>
        <div className="center">
          <h2 className="form-title" id="login" onClick={() => setIsLogin(true)}>
            <span>or</span>Log in
          </h2>
          <div className="form-holder">
            <form onSubmit={onSubmit}>
              <input
                type="email"
                className="input"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
              <button className="submit-btn" type="submit">
                {isLogin ? 'Log in' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
