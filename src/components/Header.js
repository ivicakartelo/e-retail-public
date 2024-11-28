import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to="/">Home</Link>
      <Link to="/basket">View Basket</Link>
    </nav>
  </header>
);

export default Header;