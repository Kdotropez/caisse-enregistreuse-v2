import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import DiscountManager from './parametres/DiscountManager';
import CategoryManager from './produits/CategoryManager';
import './Parametres.css';

const Parametres = () => {
  const { 
    products, 
    ventes, 
    retours, 
    employees, 
    usbConnected, 
    lastBackup,
    dispatch,
    ACTIONS 
  } = useData();

  const [showBackupModal, setShowBackupModal] = useState(false);

  const exportData = () => {
    const data = {
      products,
      ventes,
      retours,
      employees,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = url;
    a.download = `caisse_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.products) dispatch({ type: ACTIONS.SET_PRODUCTS, payload: data.products });
          if (data.ventes) dispatch({ type: ACTIONS.SET_VENTES, payload: data.ventes });
          if (data.retours) dispatch({ type: ACTIONS.SET_RETOURS, payload: data.retours });
          if (data.employees) dispatch({ type: ACTIONS.SET_EMPLOYEES, payload: data.employees });
          alert('Données importées avec succès !');
        } catch (error) {
          alert('Erreur lors de l\'import des données');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="parametres-container">
      <div className="parametres-header">
        <h1>Paramètres</h1>
      </div>

      <div className="section">
        <h2>📊 Statistiques</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Produits</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Ventes</h3>
            <p>{ventes.length}</p>
          </div>
          <div className="stat-card">
            <h3>Retours</h3>
            <p>{retours.length}</p>
          </div>
          <div className="stat-card">
            <h3>Employés</h3>
            <p>{employees.length}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🗂️ Gestion des Catégories</h2>
        <CategoryManager />
      </div>

      <div className="section">
        <h2>🎯 Gestion des Remises</h2>
        <DiscountManager />
      </div>

      <div className="section">
        <h2>💾 Sauvegarde et Restauration</h2>
        <div className="backup-actions">
          <button onClick={exportData} className="export-btn">
            📤 Exporter les données
          </button>
          <label className="import-btn">
            📥 Importer des données
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="section">
        <h2>🔌 État USB</h2>
        <div className="usb-status">
          <p>Statut: {usbConnected ? '🟢 Connecté' : '🔴 Déconnecté'}</p>
          {lastBackup && (
            <p>Dernière sauvegarde: {new Date(lastBackup).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres; 