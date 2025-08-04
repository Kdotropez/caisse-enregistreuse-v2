import React from 'react';
import './ProductTable.css';

const ProductTable = ({ 
  filteredProducts, 
  startEdit, 
  handleDeleteProduct 
}) => {
  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Code EAN</th>
            <th>Attributs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td className="product-name">{product.name}</td>
              <td className="product-price">{product.price.toFixed(2)}€</td>
              <td className="product-category">
                <span className="category-badge">{product.category}</span>
              </td>
              <td className="product-ean">{product.ean || '-'}</td>
              <td className="product-attributes">{product.attributes || '-'}</td>
              <td className="product-actions">
                <button
                  onClick={() => startEdit(product)}
                  className="edit-btn"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="delete-btn"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable; 