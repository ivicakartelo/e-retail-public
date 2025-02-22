import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState(5000); // Amount in cents, $50
  const stripe = useStripe();
  const elements = useElements();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    // Call backend to create a PaymentIntent
    const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
      amount: amount,
    });

    const { clientSecret } = data;

    // Confirm the PaymentIntent with Stripe.js
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // Payment was successful
      if (result.paymentIntent.status === 'succeeded') {
        // Notify the backend about successful payment
        const orderId = 123; // Retrieve your order ID
        await axios.post('http://localhost:5000/payment-success', {
          paymentIntentId: result.paymentIntent.id,
          orderId: orderId,
        });

        alert('Payment successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Complete Your Payment</h3>

      {/* Card Input */}
      <CardElement />

      {/* Submit Button */}
      <button type="submit" disabled={!stripe}>
        Pay ${amount / 100}
      </button>
    </form>
  );
};

export default PaymentForm;