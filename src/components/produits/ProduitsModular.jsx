import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import ProductForm from './ProductForm';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import CSVImporter from '../CSVImporter';
import './ProduitsModular.css';

const ProduitsModular = () => {
  const { products, categories, dispatch, ACTIONS } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    ean: ''
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      id: Date.now()
    };

    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: newProduct });
    setFormData({ name: '', price: '', category: '', ean: '' });
    setShowAddForm(false);
  };

  const handleEditProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      ...formData,
      price: parseFloat(formData.price)
    };

    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
    setFormData({ name: '', price: '', category: '', ean: '' });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: productId });
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      ean: product.ean || '',
      attributes: product.attributes || ''
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({ name: '', price: '', category: '', ean: '', attributes: '' });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.ean?.includes(searchQuery) ||
                         product.attributes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="produits-container">
      <div className="produits-header">
        <h1>Gestion des Produits</h1>
        <div className="produits-actions">
          <button 
            onClick={() => setShowCSVImporter(true)}
            className="import-csv-btn"
          >
            📁 Importer CSV
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-product-btn"
          >
            + Ajouter un produit
          </button>
        </div>
      </div>

      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <ProductTable
        filteredProducts={filteredProducts}
        startEdit={startEdit}
        handleDeleteProduct={handleDeleteProduct}
      />

      <ProductForm
        showForm={showAddForm}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        cancelEdit={cancelEdit}
      />

      {showCSVImporter && (
        <CSVImporter onClose={() => setShowCSVImporter(false)} />
      )}
    </div>
  );
};

export default ProduitsModular; 