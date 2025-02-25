import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // If you use URL params like order_id

const PaymentPage = () => {
  const { orderId } = useParams();  
  const [totalAmount, setTotalAmount] = useState(0); 
  const stripe = useStripe();
  const elements = useElements();

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

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
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

  return (
    <form onSubmit={handleSubmit}>
      <h3>Complete Your Payment</h3>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${totalAmount.toFixed(2)}  {/* ✅ Display correctly formatted amount */}
      </button>
    </form>
  );
};

export default PaymentPage;