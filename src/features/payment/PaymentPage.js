import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import './PaymentPage.css';  // Import custom styles

const PaymentPage = () => {
  const { orderId } = useParams();  
  const [totalAmount, setTotalAmount] = useState(0); 
  const [cardholderName, setCardholderName] = useState("");  // State to store cardholder's name
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();  // Hook to navigate to other pages

  // Fetch the order amount from your server
  useEffect(() => {
    console.log("useEffect triggered! Order ID:", orderId);

    const fetchOrderAmount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
        const amount = Number(response.data.total_amount); // ✅ Convert to number
        console.log("Total Amount Fetched:", amount);
        setTotalAmount(amount);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    if (orderId) {
      fetchOrderAmount();
    }
  }, [orderId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || totalAmount === 0) {
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
        total_amount: totalAmount * 100,  // ✅ Convert to cents
        order_id: orderId,
      });

      const { clientSecret } = data;
      console.log("Payment Intent Created:", data.clientSecret);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),  // Send card number as part of the payment
          billing_details: {
            name: cardholderName,  // Include the name of the cardholder
          },
        },
      });

      if (result.error) {
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await axios.post('http://localhost:5000/payment-success', {
            paymentIntentId: result.paymentIntent.id,
            order_id: orderId,
          });

          alert('Payment successful!');
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  // Handle the Cancel button click to navigate to the previous page
  const handleCancel = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>Complete Your Payment</h3>

      {/* Cardholder Name */}
      <div className="form-row">
        <label htmlFor="cardholder-name">Cardholder Name</label>
        <input
          id="cardholder-name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}  // Update cardholder's name
          placeholder="Cardholder Name"
          required
        />
      </div>

      {/* Card Number */}
      <div className="form-row">
        <label>Card Number</label>
        <CardNumberElement className="card-element" />
      </div>

      {/* Expiration Date */}
      <div className="form-row">
        <label>Expiration Date</label>
        <CardExpiryElement className="card-element" />
      </div>

      {/* CVC */}
      <div className="form-row">
        <label>CVC</label>
        <CardCvcElement className="card-element" />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={!stripe}>
        Pay ${totalAmount.toFixed(2)}  {/* Display correctly formatted amount */}
      </button>

      {/* Cancel Button */}
      <button type="button" onClick={handleCancel} className="cancel-button">
        Close
      </button>
    </form>
  );
};

export default PaymentPage;