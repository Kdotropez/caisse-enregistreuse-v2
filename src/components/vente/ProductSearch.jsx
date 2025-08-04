import React from 'react';
import './ProductSearch.css';

const ProductSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  barcodeInput, 
  setBarcodeInput, 
  handleBarcodeSubmit 
}) => {
  return (
    <div className="search-section">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <form onSubmit={handleBarcodeSubmit} className="barcode-form">
        <input
          type="text"
          placeholder="Scanner code-barres..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          className="barcode-input"
        />
        <button type="submit" className="barcode-button">📱</button>
      </form>
    </div>
  );
};

export default ProductSearch; 