import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const WelcomeMessage = () => {
  const user = useSelector((state) => state?.login?.user);
  const error = useSelector((state) => state?.login?.error);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route location
  const [hoverCount, setHoverCount] = useState(0); // Track the number of hovers

  // Debugging logs
  console.log("User:", user);
  console.log("Error:", error);

  if (error) return <div>{error}</div>;

  // Handle mouse over on the user's name
  const handleMouseOver = () => {
    if (!user) return; // Do nothing if no user is logged in

    // Increment the hover count
    setHoverCount((prev) => prev + 1);

    // First hover: Navigate to /customer or /dashboard based on role
    if (hoverCount === 0) {
      if (user.role === 'customer') {
        navigate('/customer');
      } else if (user.role === 'admin') {
        navigate('/dashboard');
      }
    }
    // Second hover: Navigate to /basket
    else if (hoverCount === 1) {
      navigate('/basket');
      setHoverCount(0); // Reset the hover count after navigating to /basket
    }
  };

  // Render the welcome message or prompt to log in
  return (
    <div>
      {user ? (
        <span
          style={{
            cursor: 'pointer',
            color: 'white', // White font color
            padding: '4px', // Add a little padding around the text
            transition: 'box-shadow 0.3s ease', // Smooth transition for hover effect
          }}
          onMouseOver={handleMouseOver} // Trigger on mouse over
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 1px white'; // Thin white line on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'; // Remove border on mouse leave
          }}
        >
          Welcome, {user.name}!
        </span>
      ) : (
        'Please log in.'
      )}
    </div>
  );
};

export default WelcomeMessage;