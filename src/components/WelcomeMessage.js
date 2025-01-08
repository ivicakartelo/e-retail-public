import React from 'react';
import { useSelector } from 'react-redux';

const WelcomeMessage = () => {
  const { user, error } = useSelector((state) => ({
    user: state?.login?.user,
    error: state?.login?.error,
  }));

  // Debugging logs
  console.log("User:", user);
  console.log("Error:", error);

  if (error) return <div>{error}</div>;

  // Render the welcome message or prompt to log in
  return (
    <div>
      {user ? `Welcome, ${user.name}!` : 'Please log in.'}
    </div>
  );
};

export default WelcomeMessage;