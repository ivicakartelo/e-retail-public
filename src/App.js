// src/App.js

import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import Header from './components/Header'; // Import the Header component
import { Elements, loadStripe } from '@stripe/react-stripe-js'; // Import Stripe components
import './App.css';

// Load Stripe.js script with your public key
const stripePromise = loadStripe('your-stripe-public-key'); // Replace with your Stripe public key

const App = () => {
    const { departmentId } = useParams();

    return (
        <div className="app-layout">
            <Header /> {/* Add the Header here */}
            <header>
                <DepartmentsList />
            </header>

            <div className="content-wrapper">
                <aside className="sidebar">
                    {departmentId ? (
                        <DepartmentDetails departmentId={departmentId} />
                    ) : (
                        <CategoriesList departmentId={departmentId} />
                    )}
                </aside>

                <main className="content">
                    {/* Wrap the payment form with the Elements provider */}
                    <Elements stripe={stripePromise}>
                        <Outlet />
                    </Elements>
                </main>
            </div>
        </div>
    );
};

export default App;