import React from 'react';
import MyOrders from "./MyOrders";

const Customer = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Customer!</h1>
      <p>You're logged in.</p>
      <MyOrders />
    </div>
  );
};

export default Customer;