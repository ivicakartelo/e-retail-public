import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

//const stripePromise = loadStripe('your-public-stripe-key');
const stripePromise = loadStripe('pk_test_51Nsp8pGVpnEZZ9cgc7w8adY5cH1sgLWAhWVxaUmOin7csuXbWZIa0tNIvuQZiIXOJr9oEv6wzZ0cstyVeCX1DK5k00MqzLKQx8');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment('your-client-secret', {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.log('Payment failed:', error);
      setLoading(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        // Send order details to backend to process order and payment
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay Now
      </button>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
