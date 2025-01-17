import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from './loginSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Dispatch loginUser action to log in
      const response = await dispatch(loginUser({ email, password })).unwrap();
      
      // Decode the user role from the token if available (directly from response)
      const decodedToken = JSON.parse(atob(response.token.split('.')[1]));
      const role = decodedToken.role;

      // Navigate based on the decoded role from token
      if (role === 'admin') {
        navigate('/dashboard'); // Redirect to dashboard for admin
      } else if (role === 'customer') {
        navigate('/customer'); // Redirect to customer for customer
      } else {
        navigate('/customer'); // Fallback to /customer if role is unknown
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;