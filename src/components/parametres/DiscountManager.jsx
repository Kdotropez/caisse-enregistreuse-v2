import React, { useState } from 'react';
import { useDiscounts } from '../../context/DiscountContext';
import './DiscountManager.css';

const DiscountManager = () => {
  const { presetDiscounts, addPresetDiscount, updatePresetDiscount, deletePresetDiscount, resetToDefaults } = useDiscounts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    reason: 'autre',
    icon: '💰',
    color: '#8b5cf6'
  });

  const discountTypes = [
    { value: 'percentage', label: 'Pourcentage (%)' },
    { value: 'amount', label: 'Montant fixe (€)' }
  ];

  const discountReasons = [
    { value: 'client_fidele', label: 'Client fidèle' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'defaut_produit', label: 'Défaut produit' },
    { value: 'remise_volume', label: 'Remise volume' },
    { value: 'autre', label: 'Autre' }
  ];

  const iconOptions = [
    { value: '👥', label: 'Client' },
    { value: '🎉', label: 'Promotion' },
    { value: '📦', label: 'Volume' },
    { value: '⚠️', label: 'Défaut' },
    { value: '💰', label: 'Argent' },
    { value: '🎯', label: 'Cible' },
    { value: '⭐', label: 'Étoile' },
    { value: '🏷️', label: 'Étiquette' }
  ];

  const colorOptions = [
    { value: '#3b82f6', label: 'Bleu' },
    { value: '#10b981', label: 'Vert' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Rouge' },
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#ec4899', label: 'Rose' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#84cc16', label: 'Lime' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const discountData = {
      ...formData,
      value: parseFloat(formData.value)
    };

    if (editingDiscount) {
      updatePresetDiscount(editingDiscount.id, discountData);
      setEditingDiscount(null);
    } else {
      addPresetDiscount(discountData);
    }

    resetForm();
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      type: discount.type,
      value: discount.value.toString(),
      reason: discount.reason,
      icon: discount.icon,
      color: discount.color
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette remise ?')) {
      deletePresetDiscount(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'percentage',
      value: '',
      reason: 'autre',
      icon: '💰',
      color: '#8b5cf6'
    });
    setShowAddForm(false);
    setEditingDiscount(null);
  };

  return (
    <div className="discount-manager">
      <div className="discount-manager-header">
        <h2>🎯 Gestion des remises préprogrammées</h2>
        <div className="discount-manager-actions">
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-discount-btn"
          >
            + Ajouter une remise
          </button>
          <button 
            onClick={resetToDefaults}
            className="reset-discounts-btn"
          >
            🔄 Remises par défaut
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="discount-form-overlay">
          <div className="discount-form-modal">
            <div className="discount-form-header">
              <h3>{editingDiscount ? 'Modifier la remise' : 'Ajouter une remise'}</h3>
              <button onClick={resetForm} className="close-btn">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="discount-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom de la remise *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Client fidèle"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type de remise</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    {discountTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="value">Valeur *</label>
                  <input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reason">Raison</label>
                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  >
                    {discountReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="icon">Icône</label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label} {icon.value}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Couleur</label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Annuler
                </button>
                <button type="submit" className="save-btn">
                  {editingDiscount ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="discounts-grid">
        {presetDiscounts.map(discount => (
          <div key={discount.id} className="discount-card" style={{ '--discount-color': discount.color }}>
            <div className="discount-card-header">
              <span className="discount-icon">{discount.icon}</span>
              <div className="discount-card-actions">
                <button 
                  onClick={() => handleEdit(discount)}
                  className="edit-btn"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(discount.id)}
                  className="delete-btn"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="discount-card-content">
              <h4 className="discount-name">{discount.name}</h4>
              <div className="discount-value">
                {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value}€`}
              </div>
              <div className="discount-reason">
                {discountReasons.find(r => r.value === discount.reason)?.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {presetDiscounts.length === 0 && (
        <div className="no-discounts">
          <p>Aucune remise préprogrammée</p>
          <button onClick={() => setShowAddForm(true)} className="add-first-discount-btn">
            Ajouter votre première remise
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscountManager; 