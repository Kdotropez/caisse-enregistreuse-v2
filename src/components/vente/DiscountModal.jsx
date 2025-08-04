import React, { useState } from 'react';
import { useDiscounts } from '../../context/DiscountContext';
import './DiscountModal.css';

const DiscountModal = ({ 
  showDiscount, 
  onClose, 
  cart, 
  calculateCartTotal, 
  applyDiscount 
}) => {
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const { presetDiscounts } = useDiscounts();

  const discountTypes = [
    { value: 'percentage', label: 'Pourcentage (%)', icon: '📊' },
    { value: 'amount', label: 'Montant fixe (€)', icon: '💰' }
  ];

  const discountReasons = [
    { value: 'client_fidele', label: 'Client fidèle', icon: '👥' },
    { value: 'promotion', label: 'Promotion', icon: '🎉' },
    { value: 'defaut_produit', label: 'Défaut produit', icon: '⚠️' },
    { value: 'remise_volume', label: 'Remise volume', icon: '📦' },
    { value: 'autre', label: 'Autre', icon: '📝' }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setDiscountType(preset.type);
    setDiscountValue(preset.value.toString());
    setDiscountReason(preset.reason);
  };

  const handleApplyDiscount = () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      alert('Veuillez saisir une valeur de remise valide');
      return;
    }

    const value = parseFloat(discountValue);
    const total = calculateCartTotal();
    
    let finalDiscount = 0;
    let discountAmount = 0;

    if (discountType === 'percentage') {
      if (value > 100) {
        alert('Le pourcentage ne peut pas dépasser 100%');
        return;
      }
      discountAmount = (total * value) / 100;
      finalDiscount = value;
    } else {
      if (value > total) {
        alert('La remise ne peut pas dépasser le total du panier');
        return;
      }
      discountAmount = value;
      finalDiscount = (value / total) * 100;
    }

    applyDiscount({
      type: discountType,
      value: finalDiscount,
      amount: discountAmount,
      reason: discountReason || 'Autre',
      originalTotal: total,
      presetName: selectedPreset ? selectedPreset.name : null
    });

    onClose();
  };

  const handleClose = () => {
    setDiscountValue('');
    setDiscountReason('');
    setDiscountType('percentage');
    setSelectedPreset(null);
    onClose();
  };

  const calculateNewTotal = () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      return calculateCartTotal();
    }

    const value = parseFloat(discountValue);
    const total = calculateCartTotal();

    if (discountType === 'percentage') {
      if (value > 100) return 0;
      return total - (total * value) / 100;
    } else {
      if (value > total) return 0;
      return total - value;
    }
  };

  const newTotal = calculateNewTotal();
  const discountAmount = calculateCartTotal() - newTotal;

  if (!showDiscount) return null;

  return (
    <div className="discount-modal-overlay">
      <div className="discount-modal">
        <div className="discount-modal-header">
          <h2>🎯 Appliquer une remise</h2>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>

        <div className="discount-modal-content">
          <div className="current-total">
            <h3>Total actuel</h3>
            <span className="total-amount">{calculateCartTotal().toFixed(2)}€</span>
          </div>

          <div className="preset-discounts-section">
            <h4>Remises préprogrammées</h4>
            <div className="preset-discounts-grid">
              {presetDiscounts.map(preset => (
                <button
                  key={preset.id}
                  className={`preset-discount-btn ${selectedPreset?.id === preset.id ? 'active' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                  style={{ '--preset-color': preset.color }}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                  <span className="preset-value">
                    {preset.type === 'percentage' ? `${preset.value}%` : `${preset.value}€`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-discount-section">
            <h4>Remise personnalisée</h4>
            
            <div className="discount-type-section">
              <h5>Type de remise</h5>
              <div className="discount-type-buttons">
                {discountTypes.map(type => (
                  <button
                    key={type.value}
                    className={`discount-type-btn ${discountType === type.value ? 'active' : ''}`}
                    onClick={() => setDiscountType(type.value)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="discount-value-section">
              <label htmlFor="discount-value">
                Valeur de la remise {discountType === 'percentage' ? '(%)' : '(€)'}
              </label>
              <input
                id="discount-value"
                type="number"
                value={discountValue}
                onChange={(e) => {
                  setDiscountValue(e.target.value);
                  setSelectedPreset(null); // Désélectionner le preset si on modifie manuellement
                }}
                placeholder={discountType === 'percentage' ? '10' : '5.00'}
                step={discountType === 'percentage' ? '1' : '0.01'}
                min="0"
                max={discountType === 'percentage' ? '100' : calculateCartTotal()}
                className="discount-input"
              />
            </div>

            <div className="discount-reason-section">
              <h5>Raison de la remise</h5>
              <div className="discount-reason-buttons">
                {discountReasons.map(reason => (
                  <button
                    key={reason.value}
                    className={`discount-reason-btn ${discountReason === reason.value ? 'active' : ''}`}
                    onClick={() => setDiscountReason(reason.value)}
                  >
                    <span className="reason-icon">{reason.icon}</span>
                    <span className="reason-label">{reason.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {discountValue && parseFloat(discountValue) > 0 && (
            <div className="discount-preview">
              <h4>Aperçu de la remise</h4>
              <div className="discount-preview-content">
                <div className="preview-row">
                  <span>Total original:</span>
                  <span>{calculateCartTotal().toFixed(2)}€</span>
                </div>
                <div className="preview-row discount-row">
                  <span>Remise ({discountType === 'percentage' ? `${discountValue}%` : `${discountValue}€`}):</span>
                  <span>-{discountAmount.toFixed(2)}€</span>
                </div>
                <div className="preview-row total-row">
                  <span>Nouveau total:</span>
                  <span>{newTotal.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          <div className="discount-actions">
            <button onClick={handleClose} className="cancel-btn">
              Annuler
            </button>
            <button 
              onClick={handleApplyDiscount}
              disabled={!discountValue || parseFloat(discountValue) <= 0}
              className="apply-btn"
            >
              {selectedPreset ? `Appliquer ${selectedPreset.name}` : 'Appliquer la remise'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal; 