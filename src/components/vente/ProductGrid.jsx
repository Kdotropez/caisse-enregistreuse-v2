import React, { useMemo, useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import ProductEditModal from './ProductEditModal';
import ProductPositionModal from './ProductPositionModal';
import './ProductGrid.css';

const ProductGrid = ({ filteredProducts, addToCart }) => {
  const { ventes, dispatch, ACTIONS } = useData();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [positioningProduct, setPositioningProduct] = useState(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const gridRef = useRef(null);

  // Calculer les ventes du jour pour tous les produits en une fois
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    const salesMap = new Map();
    
    ventes
      .filter(vente => new Date(vente.date).toDateString() === today)
      .forEach(vente => {
        vente.items?.forEach(item => {
          const currentCount = salesMap.get(item.id) || 0;
          salesMap.set(item.id, currentCount + item.quantity);
        });
      });
    
    return salesMap;
  }, [ventes]);

  const handleEditProduct = (e, product) => {
    e.stopPropagation(); // Empêcher l'ajout au panier
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (updatedProduct) => {
    // Le produit est déjà mis à jour via le contexte
    console.log('Produit mis à jour:', updatedProduct);
  };

  const handlePositionProduct = (e, product) => {
    e.stopPropagation(); // Empêcher l'ajout au panier
    setPositioningProduct(product);
    setShowPositionModal(true);
  };

  const handleClosePositionModal = () => {
    setShowPositionModal(false);
    setPositioningProduct(null);
  };

  const handleSavePosition = (updatedProduct) => {
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_POSITION,
      payload: {
        id: updatedProduct.id,
        position: updatedProduct.position
      }
    });
    console.log('Position mise à jour:', updatedProduct);
  };

  // Fonctions pour le drag and drop
  const handleDragStart = (e, product) => {
    e.stopPropagation();
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', product.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, cellNumber) => {
    e.preventDefault();
    setDragOverCell(cellNumber);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverCell(null);
  };

  const handleDrop = (e, cellNumber) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedProduct) {
      // Si le produit n'avait pas de position, lui en donner une
      const newPosition = cellNumber;
      
      dispatch({
        type: ACTIONS.UPDATE_PRODUCT_POSITION,
        payload: {
          id: draggedProduct.id,
          position: newPosition
        }
      });
      console.log(`Produit ${draggedProduct.name} déplacé à la position ${newPosition}`);
    }
    
    setDraggedProduct(null);
    setDragOverCell(null);
  };

  const getCellPosition = (cellNumber) => {
    const row = Math.ceil(cellNumber / 5);
    const col = ((cellNumber - 1) % 5) + 1;
    return { row, col };
  };

  // Créer un tableau de 30 cellules pour la grille
  const gridCells = Array.from({ length: 30 }, (_, index) => index + 1);

  // Organiser les produits par position et remplir les cellules vides
  const productsWithPositions = [];
  const productsWithoutPosition = [];
  
  // Séparer les produits avec et sans position
  filteredProducts.forEach(product => {
    if (product.position && product.position >= 1 && product.position <= 30) {
      productsWithPositions[product.position - 1] = product;
    } else {
      productsWithoutPosition.push(product);
    }
  });

  // Remplir les cellules vides avec les produits sans position
  let productIndex = 0;
  for (let i = 0; i < 30 && productIndex < productsWithoutPosition.length; i++) {
    if (!productsWithPositions[i]) {
      productsWithPositions[i] = productsWithoutPosition[productIndex];
      productIndex++;
    }
  }

  return (
    <div className="products-section">
      <div className="products-header">
        <h3>Produits disponibles</h3>
        <span className="products-count">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="products-grid" ref={gridRef}>
        {/* Cellules de la grille */}
        {gridCells.map(cellNumber => {
          const productInCell = productsWithPositions[cellNumber - 1];
          const isDragOver = dragOverCell === cellNumber;
          
          return (
            <div
              key={`cell-${cellNumber}`}
              className={`grid-cell ${isDragOver ? 'drag-over' : ''} ${productInCell ? 'occupied' : 'empty'}`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, cellNumber)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cellNumber)}
              data-cell-number={cellNumber}
            >
              {productInCell ? (
                <div 
                  className="product-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, productInCell)}
                  onClick={() => addToCart(productInCell)}
                >
                  <div className="product-info">
                    <h3 className="product-name">{productInCell.name}</h3>
                    {productInCell.attributes && (
                      <p className="product-attributes">{productInCell.attributes}</p>
                    )}
                    <div className="product-details">
                      <p className="product-price">{productInCell.price.toFixed(2)}€</p>
                      <div className="sales-counter">
                        <span className="sales-label">Vendus aujourd'hui:</span>
                        <span className="sales-count">{todaySales.get(productInCell.id) || 0}</span>
                      </div>
                      <p className="product-line-5">Disponible</p>
                      <p className="product-line-6">En stock</p>
                    </div>
                  </div>
                  
                  <div 
                    className="product-add product-add-top" 
                    onClick={(e) => handleEditProduct(e, productInCell)}
                    title="Modifier le produit"
                  >
                    ✏️
                  </div>
                  <div 
                    className="product-add product-add-bottom" 
                    onClick={(e) => handlePositionProduct(e, productInCell)}
                    title="Modifier la position"
                  >
                    📍
                  </div>
                </div>
              ) : (
                <div className="empty-cell">
                  <span className="cell-number">{cellNumber}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Aucun produit trouvé</p>
          <p className="no-products-hint">Essayez de changer de catégorie ou de modifier votre recherche</p>
        </div>
      )}

      {/* Instructions de drag and drop */}
      <div className="drag-instructions">
        <p>💡 <strong>Astuce :</strong> Glissez-déposez les produits pour les repositionner dans la grille</p>
      </div>

      {/* Modal de modification */}
      <ProductEditModal
        product={editingProduct}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduct}
      />

      {/* Modal de positionnement */}
      <ProductPositionModal
        product={positioningProduct}
        isOpen={showPositionModal}
        onClose={handleClosePositionModal}
        onSave={handleSavePosition}
      />
    </div>
  );
};

export default ProductGrid; 