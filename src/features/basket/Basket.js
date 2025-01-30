import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToBasket, removeArticle, clearBasket, checkoutBasket } from './basketSlice';  // Use checkoutBasket
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Basket.css';

// BasketItem component to display each article in the basket
const BasketItem = ({ article, onIncrement, onDecrement, onRemove }) => (
  <tr>
    <td>{article.name}</td>
    <td>${Number(article.price).toFixed(2)}</td>
    <td>
      <div className="quantity-control">
        <button onClick={() => onDecrement(article.article_id)}>-</button>
        <span>{article.quantity}</span>
        <button onClick={() => onIncrement(article)}>+</button>
      </div>
    </td>
    <td>${(article.price * article.quantity).toFixed(2)}</td>
    <td>
      <button className="basket-remove-button" onClick={() => onRemove(article.article_id)}>
        Remove
      </button>
    </td>
  </tr>
);

// BasketList component to handle the display and actions for all basket items
const BasketList = ({ articles, onIncrement, onDecrement, onRemove, onClear, onCheckout, onGenerateInvoice, isUserLoggedIn }) => (
  <div>
    {articles.length === 0 ? (
      <p>Your basket is empty.</p>
    ) : (
      <>
        <table className="basket-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <BasketItem
                key={article.article_id}
                article={article}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
        <div className="basket-actions">
          <p>
            <strong>
              Total Amount: $
              {articles.reduce((total, article) => total + article.price * article.quantity, 0).toFixed(2)}
            </strong>
          </p>
          <button className="basket-clear-button" onClick={onClear}>
            Clear Basket
          </button>
          <button
            className={`basket-checkout-button ${!isUserLoggedIn ? 'disabled' : ''}`}
            onClick={onCheckout}
            disabled={!isUserLoggedIn}
          >
            Checkout
          </button>
          <button className="basket-invoice-button" onClick={onGenerateInvoice}>
            Generate Invoice
          </button>
        </div>
      </>
    )}
  </div>
);

// Main Basket component which handles all interactions
const Basket = () => {
  const basketArticles = useSelector((state) => state.basket.articles);
  const user = useSelector((state) => state.login.user);  // Getting the logged-in user
  console.log(user)
  const dispatch = useDispatch();

  // Action handlers
  const handleIncrement = (article) => dispatch(addToBasket(article));
  const handleDecrement = (articleId) => dispatch(removeArticle({ article_id: articleId, decrementOnly: true }));
  const handleRemove = (articleId) => dispatch(removeArticle({ article_id: articleId }));
  const handleClear = () => window.confirm('Clear the basket?') && dispatch(clearBasket());

  // Checkout handler (dispatches checkoutBasket thunk)
  const handleCheckout = () => {
    if (basketArticles.length === 0) {
      alert('Your basket is empty.');
      return;
    }

    if (!user) {
      alert('You must be logged in to checkout!');
      return;
    }

    const orderData = {
      user_id: user.user_id,  // Using the logged-in user's ID
      articles: basketArticles.map(({ article_id, price, quantity }) => ({ article_id, price, quantity })),
      total_amount: basketArticles.reduce((total, article) => total + article.price * article.quantity, 0).toFixed(2),
    };

    dispatch(checkoutBasket(orderData))
      .unwrap() // This allows us to handle the result directly
      .then((data) => {
        alert(`Order placed successfully! Order ID: ${data.order_id}`);
        dispatch(clearBasket()); // Clear basket after successful order
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  };

  // Invoice generation handler
  const generateInvoice = () => {
    if (basketArticles.length === 0) {
      alert('Cannot generate an invoice for an empty basket.');
      return;
    }

    const doc = new jsPDF();
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const grandTotal = basketArticles.reduce((total, article) => total + article.price * article.quantity, 0).toFixed(2);

    // Adding details to the PDF
    doc.text('[LOGO]', 14, 10);
    doc.setFontSize(16).text('Awesome Company Inc.', 50, 20);
    doc.setFontSize(10).text('123 Business St., Commerce City, CA 94016', 50, 27);
    doc.text(`Phone: +1 (555) 123-4567 | Email: contact@awesomecompany.com`, 50, 32);
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 67);

    doc.autoTable({
      head: [['#', 'Article Name', 'Price', 'Quantity', 'Total']],
      body: basketArticles.map((article, index) => [
        index + 1,
        article.name,
        `$${Number(article.price).toFixed(2)}`,
        article.quantity,
        `$${(article.price * article.quantity).toFixed(2)}`,
      ]),
      startY: 80,
    });

    doc.text(`Grand Total: $${grandTotal}`, 14, doc.previousAutoTable.finalY + 10);
    doc.save(`${invoiceNumber}.pdf`);
  };

  const isUserLoggedIn = !!user; // Check if the user is logged in

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      <BasketList
        articles={basketArticles}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onClear={handleClear}
        onCheckout={handleCheckout}
        onGenerateInvoice={generateInvoice}
        isUserLoggedIn={isUserLoggedIn}
      />
    </div>
  );
};

export default Basket;