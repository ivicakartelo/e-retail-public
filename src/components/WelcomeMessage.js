import React from 'react';
import { useSelector } from 'react-redux';

const WelcomeMessage = () => {
  // Directly select user and error, not creating a new object
  const user = useSelector((state) => state?.login?.user);
  const error = useSelector((state) => state?.login?.error);

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