import React from 'react';
import './ShoppingCart.css';

const ShoppingCart = ({
  cart,
  calculateCartTotal,
  updateQuantity,
  handlePayment,
  handleDiscount,
  currentDiscount,
  onEditItem
}) => {
  return (
    <div className="cart-section">
      <div className="cart-header">
        <h2>🛒 Panier</h2>
        <span className="cart-count">{cart.length} article{cart.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-header">
                <h3 className="cart-item-name">{item.name}</h3>
                <button 
                  className="edit-item-btn"
                  onClick={() => onEditItem(item)}
                  title="Modifier les caractéristiques"
                >
                  ✏️
                </button>
              </div>
              {item.attributes && (
                <p className="cart-item-attributes">{item.attributes}</p>
              )}
              <p className="cart-item-category">Catégorie: {item.category}</p>
              <p className="cart-item-price">{item.price.toFixed(2)}€</p>
            </div>
            
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-total">
        {currentDiscount && (
          <div className="discount-info">
            <div className="discount-details">
              <span className="discount-label">
                {currentDiscount.presetName || 'Remise appliquée:'}
              </span>
              <span className="discount-value">
                {currentDiscount.type === 'percentage'
                  ? `${currentDiscount.value}%`
                  : `${currentDiscount.value}€`
                }
              </span>
            </div>
            <div className="discount-amount">
              -{currentDiscount.amount.toFixed(2)}€
            </div>
          </div>
        )}
        <h3>Total: {calculateCartTotal().toFixed(2)}€</h3>
      </div>
      <div className="cart-actions">
        <button
          onClick={handleDiscount}
          disabled={cart.length === 0}
          className="discount-btn"
        >
          🎯 REMISE
        </button>
        <button
          onClick={handlePayment}
          disabled={cart.length === 0}
          className="payment-btn"
        >
          Payer
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart; 