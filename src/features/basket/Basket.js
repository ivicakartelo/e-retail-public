import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearBasket } from './basketSlice';
import './Basket.css'; // Optional: Add styles if needed

const Basket = () => {
  const basketItems = useSelector((state) => state.basket.items);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleClearBasket = () => {
    if (window.confirm('Are you sure you want to clear the basket?')) {
      dispatch(clearBasket());
    }
  };

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      {basketItems.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div>
          <table className="basket-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {basketItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="basket-remove-button"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="basket-actions">
            <p>
              <strong>
                Total Amount: $
                {basketItems
                  .reduce((total, item) => total + item.price * item.quantity, 0)
                  .toFixed(2)}
              </strong>
            </p>
            <button
              className="basket-clear-button"
              onClick={handleClearBasket}
            >
              Clear Basket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;