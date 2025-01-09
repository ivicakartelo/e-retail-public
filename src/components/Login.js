import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './loginSlice'; // Assuming you have a loginSlice
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State variables for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const user = useSelector((state) => state.login.user);

  // Automatically navigate based on user role when the user logs in
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/dashboard'); // Redirect to dashboard for admin
    } else if (user?.role === 'customer') {
      navigate('/customer'); // Redirect to customer page for customer
    }
  }, [user, navigate]);

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Dispatch loginUser action with email and password
      const response = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful:', response);
    } catch (err) {
      // Set error message if login fails
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {/* Show error message if there's an error */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display login form if no user is logged in */}
      {!user ? (
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email" // Add autocomplete for email
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password" // Add autocomplete for password
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        // Show welcome message if user is logged in
        <div>Welcome, {user.name}!</div>
      )}
    </div>
  );
};

export default Login;