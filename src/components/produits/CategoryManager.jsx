import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import './CategoryManager.css';

const CategoryManager = () => {
  const { categories, products, dispatch, ACTIONS } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getProductCountForCategory = (category) => {
    return products.filter(p => p.category === category).length;
  };

  const handleDeleteCategory = (category) => {
    const productCount = getProductCountForCategory(category);
    
    if (productCount > 0) {
      const confirmMessage = `Êtes-vous sûr de vouloir supprimer la catégorie "${category}" ?\n\nCette action supprimera également ${productCount} produit${productCount > 1 ? 's' : ''} de cette catégorie.\n\nCette action est irréversible !`;
      
      if (window.confirm(confirmMessage)) {
        dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: category });
        setShowDeleteConfirm(null);
      }
    } else {
      dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: category });
    }
  };

  const sortedCategories = categories
    .map(category => ({
      name: category,
      productCount: getProductCountForCategory(category)
    }))
    .sort((a, b) => b.productCount - a.productCount); // Trier par nombre de produits décroissant

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h2>🗂️ Gestion des Catégories</h2>
        <p className="category-manager-subtitle">
          Gérez vos catégories et supprimez celles qui ne sont plus nécessaires
        </p>
      </div>

      <div className="categories-list">
        {sortedCategories.map(({ name, productCount }) => (
          <div key={name} className="category-item">
            <div className="category-info">
              <h3 className="category-name">{name}</h3>
              <div className="category-stats">
                <span className="product-count">
                  {productCount} produit{productCount !== 1 ? 's' : ''}
                </span>
                {productCount > 0 && (
                  <span className="warning-badge">⚠️ Contient des produits</span>
                )}
              </div>
            </div>
            
            <div className="category-actions">
              {productCount > 0 ? (
                <button
                  onClick={() => handleDeleteCategory(name)}
                  className="delete-category-btn danger"
                  title={`Supprimer la catégorie "${name}" et ses ${productCount} produit${productCount > 1 ? 's' : ''}`}
                >
                  🗑️ Supprimer avec produits
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteCategory(name)}
                  className="delete-category-btn"
                  title={`Supprimer la catégorie "${name}" (vide)`}
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="no-categories">
          <p>Aucune catégorie trouvée</p>
        </div>
      )}

      <div className="category-manager-footer">
        <div className="warning-info">
          <h4>⚠️ Attention</h4>
          <ul>
            <li>La suppression d'une catégorie supprime également tous les produits qu'elle contient</li>
            <li>Cette action est irréversible</li>
            <li>Assurez-vous de sauvegarder vos données avant toute suppression</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager; 