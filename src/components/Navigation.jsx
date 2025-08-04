import React from 'react';
import './Navigation.css';

const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'vente', label: 'Vente', icon: '🛒' },
    { id: 'produits', label: 'Produits', icon: '📦' },
    { id: 'rapports', label: 'Rapports', icon: '📊' },
    { id: 'retours', label: 'Retours', icon: '↩️' },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 