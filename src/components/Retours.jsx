import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Retours.css';

const Retours = () => {
  const { ventes, retours, dispatch, ACTIONS } = useData();
  
  const [selectedVente, setSelectedVente] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');

  const handleVenteSelect = (vente) => {
    setSelectedVente(vente);
    setReturnItems([]);
  };

  const toggleItemReturn = (item) => {
    const existingIndex = returnItems.findIndex(ri => ri.id === item.id);
    if (existingIndex >= 0) {
      setReturnItems(returnItems.filter((_, index) => index !== existingIndex));
    } else {
      setReturnItems([...returnItems, { ...item, returnQuantity: item.quantity }]);
    }
  };

  const updateReturnQuantity = (itemId, quantity) => {
    setReturnItems(returnItems.map(item => 
      item.id === itemId ? { ...item, returnQuantity: Math.max(0, Math.min(quantity, item.quantity)) } : item
    ));
  };

  const processReturn = () => {
    if (returnItems.length === 0) {
      alert('Veuillez sélectionner au moins un article à retourner');
      return;
    }

    if (!returnReason.trim()) {
      alert('Veuillez indiquer la raison du retour');
      return;
    }

    const totalReturn = returnItems.reduce((sum, item) => sum + (item.price * item.returnQuantity), 0);

    const retour = {
      date: new Date().toISOString(),
      originalVenteId: selectedVente.id,
      items: returnItems,
      total: totalReturn,
      reason: returnReason,
      employee: 'Employé 1'
    };

    dispatch({ type: ACTIONS.ADD_RETOUR, payload: retour });
    
    setSelectedVente(null);
    setReturnItems([]);
    setReturnReason('');
    
    alert(`Retour enregistré ! Montant remboursé: ${totalReturn.toFixed(2)}€`);
  };

  return (
    <div className="retours-container">
      <div className="retours-header">
        <h1>Gestion des Retours</h1>
      </div>

      <div className="retours-content">
        <div className="ventes-list">
          <h2>Sélectionner une vente</h2>
          <div className="ventes-grid">
            {ventes.map(vente => (
              <div 
                key={vente.id} 
                className={`vente-card ${selectedVente?.id === vente.id ? 'selected' : ''}`}
                onClick={() => handleVenteSelect(vente)}
              >
                <div className="vente-header">
                  <span className="vente-date">
                    {new Date(vente.date).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="vente-time">
                    {new Date(vente.date).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
                <div className="vente-total">{vente.total.toFixed(2)}€</div>
                <div className="vente-items">
                  {vente.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedVente && (
          <div className="return-form">
            <h2>Retour - Vente du {new Date(selectedVente.date).toLocaleDateString('fr-FR')}</h2>
            
            <div className="items-selection">
              <h3>Sélectionner les articles à retourner</h3>
              {selectedVente.items.map(item => {
                const returnItem = returnItems.find(ri => ri.id === item.id);
                const isSelected = returnItem !== undefined;
                
                return (
                  <div key={item.id} className={`item-row ${isSelected ? 'selected' : ''}`}>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price.toFixed(2)}€</span>
                    </div>
                    <div className="item-quantity">
                      <span>Quantité achetée: {item.quantity}</span>
                      {isSelected && (
                        <div className="return-quantity">
                          <label>Quantité à retourner:</label>
                          <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={returnItem.returnQuantity}
                            onChange={(e) => updateReturnQuantity(item.id, parseInt(e.target.value))}
                            className="quantity-input"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleItemReturn(item)}
                      className={`select-btn ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected ? '✓' : 'Sélectionner'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="return-reason">
              <label>Raison du retour:</label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Indiquez la raison du retour..."
                className="reason-input"
              />
            </div>

            <div className="return-summary">
              <h3>Résumé du retour</h3>
              <div className="return-items">
                {returnItems.map(item => (
                  <div key={item.id} className="return-item">
                    <span>{item.name}</span>
                    <span>{item.returnQuantity} x {item.price.toFixed(2)}€</span>
                    <span>{(item.price * item.returnQuantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              <div className="return-total">
                <strong>Total remboursé: {returnItems.reduce((sum, item) => sum + (item.price * item.returnQuantity), 0).toFixed(2)}€</strong>
              </div>
            </div>

            <button 
              onClick={processReturn}
              disabled={returnItems.length === 0}
              className="process-return-btn"
            >
              Traiter le retour
            </button>
          </div>
        )}
      </div>

      <div className="retours-history">
        <h2>Historique des retours</h2>
        <div className="retours-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vente originale</th>
                <th>Articles retournés</th>
                <th>Montant remboursé</th>
                <th>Raison</th>
              </tr>
            </thead>
            <tbody>
              {retours.map(retour => (
                <tr key={retour.id}>
                  <td>{new Date(retour.date).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(retour.date).toLocaleTimeString('fr-FR')}</td>
                  <td>{retour.items.map(item => `${item.name} (${item.returnQuantity})`).join(', ')}</td>
                  <td>{retour.total.toFixed(2)}€</td>
                  <td>{retour.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Retours; 