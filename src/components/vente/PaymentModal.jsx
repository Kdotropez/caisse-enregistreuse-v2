import React from 'react';
import './PaymentModal.css';

const PaymentModal = ({ 
  showPayment, 
  onClose,
  onConfirm,
  paymentMethod, 
  setPaymentMethod, 
  amountReceived, 
  setAmountReceived, 
  total
}) => {
  if (!showPayment) return null;

  return (
    <div className="payment-modal">
      <div className="payment-content">
        <h2>Paiement</h2>
        <p>Total: {total.toFixed(2)}€</p>
        
        <div className="payment-methods">
          <button
            className={`payment-method ${paymentMethod === 'especes' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('especes')}
          >
            💰 Espèces
          </button>
          <button
            className={`payment-method ${paymentMethod === 'carte' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('carte')}
          >
            💳 Carte bancaire
          </button>
          <button
            className={`payment-method ${paymentMethod === 'cheque' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cheque')}
          >
            📄 Chèque
          </button>
        </div>

        {paymentMethod === 'especes' && (
          <div className="amount-section">
            <label>Montant reçu:</label>
            <input
              type="number"
              step="0.01"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="0.00"
              className="amount-input"
            />
            {amountReceived && (
              <p>Rendu: {(parseFloat(amountReceived) - total).toFixed(2)}€</p>
            )}
          </div>
        )}

        <div className="payment-actions">
          <button onClick={onConfirm} className="confirm-btn">
            Confirmer
          </button>
          <button onClick={onClose} className="cancel-btn">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 