import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import './ProductEditModal.css';

const ProductEditModal = ({ product, isOpen, onClose, onSave }) => {
  const { categories, dispatch, ACTIONS } = useData();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    ean: '',
    wholesalePrice: '',
    originalPrice: '',
    discount: '',
    attributes: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        ean: product.ean || '',
        wholesalePrice: product.wholesalePrice || '',
        originalPrice: product.originalPrice || '',
        discount: product.discount || '',
        attributes: product.attributes || ''
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      ...product,
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      ean: formData.ean,
      wholesalePrice: parseFloat(formData.wholesalePrice) || 0,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      discount: parseFloat(formData.discount) || 0,
      attributes: formData.attributes
    };

    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
    onSave(updatedProduct);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="product-edit-overlay">
      <div className="product-edit-modal">
        <div className="product-edit-header">
          <h2>Modifier le produit</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-edit-form">
          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Prix de vente (€) *</label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ean">Code EAN-13</label>
              <input
                type="text"
                id="ean"
                value={formData.ean}
                onChange={(e) => handleInputChange('ean', e.target.value)}
                className="form-input"
                placeholder="1234567890123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="wholesalePrice">Prix de gros (€)</label>
              <input
                type="number"
                id="wholesalePrice"
                step="0.01"
                min="0"
                value={formData.wholesalePrice}
                onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originalPrice">Prix barré (€)</label>
              <input
                type="number"
                id="originalPrice"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="discount">Remise (€)</label>
              <input
                type="number"
                id="discount"
                step="0.01"
                min="0"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attributes">Attributs</label>
            <textarea
              id="attributes"
              value={formData.attributes}
              onChange={(e) => handleInputChange('attributes', e.target.value)}
              className="form-input"
              rows="3"
              placeholder="Attributs séparés par des virgules..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Annuler
            </button>
            <button type="submit" className="save-btn">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal; 