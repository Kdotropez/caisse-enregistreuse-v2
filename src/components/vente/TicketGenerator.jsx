import React from 'react';
import './TicketGenerator.css';

const TicketGenerator = ({ vente, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    return vente.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const ticketContent = document.getElementById('ticket-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Caisse</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              margin: 0;
              padding: 10px;
              width: 300px;
            }
            .ticket {
              border: 1px solid #000;
              padding: 10px;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .item {
              margin-bottom: 5px;
              border-bottom: 1px dotted #ccc;
              padding-bottom: 5px;
            }
            .item-name {
              font-weight: bold;
            }
            .item-details {
              font-size: 10px;
              color: #666;
              margin-left: 10px;
            }
            .item-price {
              text-align: right;
            }
            .total {
              border-top: 1px solid #000;
              padding-top: 10px;
              margin-top: 10px;
              font-weight: bold;
            }
            .payment {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px dotted #000;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          ${ticketContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="ticket-modal">
      <div className="ticket-content">
        <div className="ticket-header">
          <h2>🎫 Ticket de Caisse</h2>
          <div className="ticket-actions">
            <button onClick={handlePrint} className="print-btn">
              🖨️ Imprimer
            </button>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>
        </div>

        <div id="ticket-content" className="ticket">
          <div className="header">
            <h3>CAISSE ENREGISTREUSE V2</h3>
            <p>Date: {formatDate(vente.date)}</p>
            <p>Heure: {formatTime(vente.date)}</p>
            <p>Ticket N°: {vente.id || Date.now()}</p>
          </div>

          <div className="items">
            {vente.items.map((item, index) => (
              <div key={index} className="item">
                <div className="item-header">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {item.price.toFixed(2)}€ x {item.quantity}
                  </span>
                </div>
                {item.attributes && (
                  <div className="item-details">
                    Attributs: {item.attributes}
                  </div>
                )}
                <div className="item-total">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>

          <div className="totals">
            <div className="subtotal">
              <span>Sous-total:</span>
              <span>{calculateSubtotal().toFixed(2)}€</span>
            </div>
            
            {vente.discount && (
              <div className="discount">
                <span>Remise ({vente.discount.type === 'percentage' ? `${vente.discount.value}%` : `${vente.discount.value}€`}):</span>
                <span>-{vente.discount.amount.toFixed(2)}€</span>
              </div>
            )}
            
            <div className="total">
              <span>TOTAL:</span>
              <span>{vente.total.toFixed(2)}€</span>
            </div>
          </div>

          <div className="payment">
            <p>Mode de paiement: {vente.paymentMethod}</p>
            {vente.paymentMethod === 'especes' && (
              <>
                <p>Montant reçu: {vente.amountReceived.toFixed(2)}€</p>
                <p>Monnaie rendue: {vente.change.toFixed(2)}€</p>
              </>
            )}
          </div>

          <div className="footer">
            <p>Merci de votre visite !</p>
            <p>Employé: {vente.employee}</p>
            <p>www.caisse-enregistreuse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator; 