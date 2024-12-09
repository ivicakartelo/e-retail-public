import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToBasket, removeArticle, clearBasket } from './basketSlice';
import jsPDF from 'jspdf'; // Add jsPDF for PDF generation
import 'jspdf-autotable'; // Import autoTable for tables
import './Basket.css'; // Optional: Add styles if needed

const Basket = () => {
  const basketArticles = useSelector((state) => state.basket.articles);
  const dispatch = useDispatch();

  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = new Date().getTime(); // Current timestamp
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}-${timestamp}-${randomNumber}`;
  };
/*
  const handleRemove = (id) => {
    if (!id) {
      console.error('Invalid article id:', id);
      return; // Prevent dispatching if id is missing
    }
    dispatch(removeArticle({ id }));
  }
*/
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

    // Add company logo and details
    const companyDetails = {
      name: "Awesome Company Inc.",
      address: "123 Business St., Commerce City, CA 94016",
      bankDetails: "Bank Account: 123456789, IBAN: US00ABC123456789, SWIFT: ABCDUS33",
      email: "contact@awesomecompany.com",
      phone: "+1 (555) 123-4567",
    };

    // Logo Placeholder
    const logoX = 14;
    const logoY = 10;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('[LOGO]', logoX, logoY);

    // Company Information
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 153); // Blue color for company name
    doc.text(companyDetails.name, 50, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black for regular text
    doc.text(companyDetails.address, 50, 27);
    doc.text(`Phone: ${companyDetails.phone}`, 50, 32);
    doc.text(`Email: ${companyDetails.email}`, 50, 37);
    doc.text(`Bank Details: ${companyDetails.bankDetails}`, 50, 42);

    // Generate invoice number and date
    const invoiceNumber = generateInvoiceNumber();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for the rest
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 67);

    // Add table for basket articles
    const tableData = basketArticles.map((article, index) => [
      index + 1,
      article.name,
      `$${Number(article.price).toFixed(2)}`,
      article.quantity,
      `$${(article.price * article.quantity).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [['#', 'Article Name', 'Price', 'Quantity', 'Total']],
      body: tableData,
      startY: 80,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 51, 153],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Calculate grand total
    const grandTotal = basketArticles
      .reduce((total, article) => total + article.price * article.quantity, 0)
      .toFixed(2);

    // Add grand total
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for text
    doc.text(`Grand Total: $${grandTotal}`, 14, doc.previousAutoTable.finalY + 10);

    // Save the PDF
    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      {basketArticles.length === 0 ? (
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
              {basketArticles.map((article) => (
                <tr key={article.article_id}>
                  <td>{article.name}</td>
                  <td>${Number(article.price).toFixed(2)}</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        className="minus-button"
                        onClick={() =>
                          dispatch(removeArticle({ article_id: article.article_id, decrementOnly: true }))
                        }
                      >
                        -
                      </button>
                      <span>{article.quantity}</span>
                      <button
                        className="plus-button"
                        onClick={() => dispatch(addToBasket(article))}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(article.price * article.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="basket-remove-button"
                      onClick={() => 
                        dispatch(removeArticle({ article_id: article.article_id, decrementOnly: true }))
                      }
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
                {basketArticles
                  .reduce((total, article) => total + article.price * article.quantity, 0)
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