import React, { useState } from 'react';
import MyOrders from "./MyOrders";

const Customer = () => {
  const [showOrders, setShowOrders] = useState(false);

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Customer!</h1>
      <p>You're logged in.</p>
      <h2>Your Account</h2>
      
      <nav>
        
          <button onClick={() => setShowOrders(!showOrders)}>Orders</button> | 
          <button>Profile</button> | 
          <button>Settings</button> | 
        
      </nav>
      
      {showOrders && <MyOrders />}
    </div>
  );
};

export default Customer;