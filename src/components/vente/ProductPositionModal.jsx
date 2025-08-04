import React, { useState, useEffect } from 'react';
import './ProductPositionModal.css';

const ProductPositionModal = ({ product, isOpen, onClose, onSave }) => {
  const [position, setPosition] = useState(1);
  const [selectedCell, setSelectedCell] = useState(null);

  // Grille 5x6 = 30 positions
  const totalCells = 30;
  const gridColumns = 5;
  const gridRows = 6;

  useEffect(() => {
    if (product) {
      setPosition(product.position || 1);
      setSelectedCell(product.position || 1);
    }
  }, [product]);

  const handleCellClick = (cellNumber) => {
    setSelectedCell(cellNumber);
    setPosition(cellNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      position: position
    };
    onSave(updatedProduct);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="product-position-overlay">
      <div className="product-position-modal">
        <div className="product-position-header">
          <h2>Positionner le produit</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="product-position-content">
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>Prix: {product.price.toFixed(2)}€</p>
            <p>Catégorie: {product.category}</p>
          </div>

          <div className="position-selector">
            <h4>Sélectionnez la position dans la grille :</h4>
            <div className="grid-preview">
              {Array.from({ length: totalCells }, (_, index) => {
                const cellNumber = index + 1;
                const isSelected = selectedCell === cellNumber;
                const hasProduct = false; // TODO: Vérifier si une position est déjà occupée
                
                return (
                  <div
                    key={cellNumber}
                    className={`grid-cell ${isSelected ? 'selected' : ''} ${hasProduct ? 'occupied' : ''}`}
                    onClick={() => handleCellClick(cellNumber)}
                    title={`Position ${cellNumber}`}
                  >
                    {cellNumber}
                  </div>
                );
              })}
            </div>
            
            <div className="position-info">
              <p>Position sélectionnée : <strong>{position}</strong></p>
              <p className="position-hint">
                La grille fait 5 colonnes × 6 lignes = 30 positions
              </p>
            </div>
          </div>
        </div>

        <div className="position-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Annuler
          </button>
          <button type="button" onClick={handleSubmit} className="save-btn">
            Sauvegarder la position
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPositionModal; 