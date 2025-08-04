import React from 'react';
import './ProductForm.css';

const ProductForm = ({ 
  showForm, 
  editingProduct, 
  formData, 
  setFormData, 
  categories, 
  handleAddProduct, 
  handleEditProduct, 
  cancelEdit 
}) => {
  if (!showForm && !editingProduct) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      handleEditProduct();
    } else {
      handleAddProduct();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="product-form-modal">
      <div className="product-form-content">
        <div className="form-header">
          <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
          <button 
            type="button" 
            onClick={cancelEdit} 
            className="close-form-btn"
            title="Fermer"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nom du produit"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Catégorie *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ean">Code EAN</label>
            <input
              type="text"
              id="ean"
              name="ean"
              value={formData.ean}
              onChange={handleInputChange}
              placeholder="Code-barres (optionnel)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attributes">Attributs</label>
            <input
              type="text"
              id="attributes"
              name="attributes"
              value={formData.attributes}
              onChange={handleInputChange}
              placeholder="Ex: XXL, XL, Rouge, etc. (optionnel)"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingProduct ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={cancelEdit} className="cancel-btn">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 