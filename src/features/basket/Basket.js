import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToBasket, removeItem, clearBasket } from './basketSlice';
import jsPDF from 'jspdf'; // Add jsPDF for PDF generation
import 'jspdf-autotable'; // Import autoTable for tables
import './Basket.css'; // Optional: Add styles if needed

const Basket = () => {
  const basketItems = useSelector((state) => state.basket.items);
  const dispatch = useDispatch();

  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = new Date().getTime(); // Current timestamp
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}-${timestamp}-${randomNumber}`;
  };

  const handleRemove = (id) => {
    if (!id) {
      console.error('Invalid item id:', id);
      return; // Prevent dispatching if id is missing
    }
    dispatch(removeItem({ article_id: id })); // Ensure payload matches reducer expectations
  };

  const handleClearBasket = () => {
    if (window.confirm('Are you sure you want to clear the basket?')) {
      dispatch(clearBasket());
    }
  };

  const handleGenerateInvoice = () => {
    if (basketItems.length === 0) {
      alert('Your basket is empty. Cannot generate an invoice.');
      return;
    }

    const doc = new jsPDF();
    const invoiceNumber = generateInvoiceNumber();

    // Add a title and invoice number
    doc.setFontSize(18);
    doc.text('Invoice', 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 37);

    // Add invoice table
    const tableData = basketItems.map((item, index) => [
      index + 1,
      item.name,
      `$${Number(item.price).toFixed(2)}`,
      item.quantity,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [['#', 'Item Name', 'Price', 'Quantity', 'Total']],
      body: tableData,
      startY: 45,
    });

    // Calculate grand total
    const grandTotal = basketItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

    // Add grand total at the bottom
    doc.setFontSize(14);
    doc.text(`Grand Total: $${grandTotal}`, 14, doc.previousAutoTable.finalY + 10);

    // Save the PDF
    doc.save(`${invoiceNumber}.pdf`);
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
                <tr key={item.article_id}>
                  <td>{item.name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        className="minus-button"
                        onClick={() => dispatch(removeItem({ article_id: item.article_id }))}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="plus-button"
                        onClick={() => dispatch(addToBasket(item))}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="basket-remove-button"
                      onClick={() => handleRemove(item.article_id)}
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
            <button className="basket-clear-button" onClick={handleClearBasket}>
              Clear Basket
            </button>
            <button
              className="basket-invoice-button"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;