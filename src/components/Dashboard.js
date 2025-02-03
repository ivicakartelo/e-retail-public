import React from 'react';
import MyOrders from "./MyOrders";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard!</h1>
      <p>You're logged in.</p>
      <MyOrders />
    </div>
  );
};

export default Dashboard;