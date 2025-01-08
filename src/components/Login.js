import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './loginSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login.user); // Access user from Redux state

  // Automatically navigate based on user role when the user logs in
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/dashboard'); // Redirect to dashboard for admin
    } else if (user?.role === 'customer') {
      navigate('/customer'); // Redirect to customer for customer
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful:', response);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!user ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>Welcome, {user.name}!</div>
      )}
    </div>
  );
};

export default Login;