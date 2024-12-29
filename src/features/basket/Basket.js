import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToBasket, removeArticle, clearBasket } from './basketSlice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Basket.css';

// BasketArticleExcerpt Component
const BasketArticleExcerpt = ({ article, onIncrement, onDecrement, onRemove }) => {
  return (
    <tr key={article.article_id}>
      <td>{article.name}</td>
      <td>${Number(article.price).toFixed(2)}</td>
      <td>
        <div className="quantity-control">
          <button
            className="minus-button"
            onClick={() => onDecrement(article.article_id)}
          >
            -
          </button>
          <span>{article.quantity}</span>
          <button
            className="plus-button"
            onClick={() => onIncrement(article)}
          >
            +
          </button>
        </div>
      </td>
      <td>${(article.price * article.quantity).toFixed(2)}</td>
      <td>
        <button
          className="basket-remove-button"
          onClick={() => onRemove(article.article_id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

// BasketArticlesList Component
const BasketArticlesList = ({
  articles,
  onIncrement,
  onDecrement,
  onRemove,
  onClearBasket,
  onGenerateInvoice,
}) => {
  return (
    <div>
      {articles.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div>
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
                <BasketArticleExcerpt
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
                {articles
                  .reduce((total, article) => total + article.price * article.quantity, 0)
                  .toFixed(2)}
              </strong>
            </p>
            <button className="basket-clear-button" onClick={onClearBasket}>
              Clear Basket
            </button>
            <button
              className="basket-invoice-button"
              onClick={onGenerateInvoice}
            >
              Generate Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Basket Component
const Basket = () => {
  const basketArticles = useSelector((state) => state.basket.articles);
  console.log(basketArticles)
  const dispatch = useDispatch();

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${randomNumber}`;
  };

  const handleIncrement = (article) => {
    dispatch(addToBasket(article));
  };

  const handleDecrement = (articleId) => {
    dispatch(removeArticle({ article_id: articleId, decrementOnly: true }));
  };

  const handleRemove = (articleId) => {
    dispatch(removeArticle({ article_id: articleId }));
  };

  const handleClearBasket = () => {
    if (window.confirm('Are you sure you want to clear the basket?')) {
      dispatch(clearBasket());
    }
  };

  const handleGenerateInvoice = () => {
    if (basketArticles.length === 0) {
      alert('Your basket is empty. Cannot generate an invoice.');
      return;
    }

    const doc = new jsPDF();

    const companyDetails = {
      name: 'Awesome Company Inc.',
      address: '123 Business St., Commerce City, CA 94016',
      bankDetails: 'Bank Account: 123456789, IBAN: US00ABC123456789, SWIFT: ABCDUS33',
      email: 'contact@awesomecompany.com',
      phone: '+1 (555) 123-4567',
    };

    doc.text('[LOGO]', 14, 10);
    doc.setFontSize(16);
    doc.text(companyDetails.name, 50, 20);
    doc.setFontSize(10);
    doc.text(companyDetails.address, 50, 27);
    doc.text(`Phone: ${companyDetails.phone}`, 50, 32);
    doc.text(`Email: ${companyDetails.email}`, 50, 37);
    doc.text(`Bank Details: ${companyDetails.bankDetails}`, 50, 42);

    const invoiceNumber = generateInvoiceNumber();
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 67);

    const tableData = basketArticles.map((article, index) => [
      index + 1,
      article.name,
      `$${Number(article.price).toFixed(2)}`,
      article.quantity,
      `$${(article.price * Number(article.quantity)).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [['#', 'Article Name', 'Price', 'Quantity', 'Total']],
      body: tableData,
      startY: 80,
    });

    const grandTotal = basketArticles.reduce(
      (total, article) => total + article.price * article.quantity,
      0
    ).toFixed(2);

    doc.text(`Grand Total: $${grandTotal}`, 14, doc.previousAutoTable.finalY + 10);
    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      <BasketArticlesList
        articles={basketArticles}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onClearBasket={handleClearBasket}
        onGenerateInvoice={handleGenerateInvoice}
      />
    </div>
  );
};

export default Basket;