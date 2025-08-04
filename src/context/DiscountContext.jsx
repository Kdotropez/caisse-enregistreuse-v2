import React, { createContext, useContext, useState, useEffect } from 'react';

const DiscountContext = createContext();

// Remises préprogrammées par défaut
const defaultPresetDiscounts = [
  { id: 1, name: 'Client fidèle', type: 'percentage', value: 10, reason: 'client_fidele', icon: '👥', color: '#3b82f6' },
  { id: 2, name: 'Promotion -10%', type: 'percentage', value: 10, reason: 'promotion', icon: '🎉', color: '#10b981' },
  { id: 3, name: 'Promotion -20%', type: 'percentage', value: 20, reason: 'promotion', icon: '🎉', color: '#10b981' },
  { id: 4, name: 'Remise volume', type: 'percentage', value: 15, reason: 'remise_volume', icon: '📦', color: '#f59e0b' },
  { id: 5, name: 'Défaut produit', type: 'percentage', value: 25, reason: 'defaut_produit', icon: '⚠️', color: '#ef4444' },
  { id: 6, name: 'Remise 5€', type: 'amount', value: 5, reason: 'autre', icon: '💰', color: '#8b5cf6' },
  { id: 7, name: 'Remise 10€', type: 'amount', value: 10, reason: 'autre', icon: '💰', color: '#8b5cf6' },
  { id: 8, name: 'Remise 20€', type: 'amount', value: 20, reason: 'autre', icon: '💰', color: '#8b5cf6' }
];

export function DiscountProvider({ children }) {
  const [presetDiscounts, setPresetDiscounts] = useState(defaultPresetDiscounts);

  // Charger les remises depuis le localStorage
  useEffect(() => {
    const savedDiscounts = localStorage.getItem('preset_discounts');
    if (savedDiscounts) {
      try {
        const parsedDiscounts = JSON.parse(savedDiscounts);
        setPresetDiscounts(parsedDiscounts);
      } catch (error) {
        console.error('Erreur lors du chargement des remises:', error);
      }
    }
  }, []);

  // Sauvegarder les remises dans le localStorage
  useEffect(() => {
    localStorage.setItem('preset_discounts', JSON.stringify(presetDiscounts));
  }, [presetDiscounts]);

  const addPresetDiscount = (discount) => {
    const newDiscount = {
      ...discount,
      id: Date.now()
    };
    setPresetDiscounts(prev => [...prev, newDiscount]);
  };

  const updatePresetDiscount = (id, updatedDiscount) => {
    setPresetDiscounts(prev => 
      prev.map(discount => 
        discount.id === id ? { ...discount, ...updatedDiscount } : discount
      )
    );
  };

  const deletePresetDiscount = (id) => {
    setPresetDiscounts(prev => prev.filter(discount => discount.id !== id));
  };

  const resetToDefaults = () => {
    setPresetDiscounts(defaultPresetDiscounts);
  };

  const value = {
    presetDiscounts,
    addPresetDiscount,
    updatePresetDiscount,
    deletePresetDiscount,
    resetToDefaults
  };

  return (
    <DiscountContext.Provider value={value}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscounts() {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscounts doit être utilisé dans un DiscountProvider');
  }
  return context;
} 