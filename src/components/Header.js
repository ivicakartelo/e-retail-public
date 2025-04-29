import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './loginSlice'; // Import the logout action
import WelcomeMessage from './WelcomeMessage';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login.user);

  const handleLogout = () => {
    dispatch(logout()); // Clear user state
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="app-header">
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/basket">View Basket</Link>
        {/* Add a link to the Recommendations component */}
        <Link to="/recommendations">AI Recommendations</Link>
        <Link to="/thinking">Gemini 2.5 Thinking</Link>
      </nav>
      <div className="auth-buttons">
        <WelcomeMessage />
        {user ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/registration">
              <button className="registration-button">Register</button>
            </Link>
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;