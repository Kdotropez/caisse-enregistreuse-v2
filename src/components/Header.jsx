import React from 'react';
import './Header.css';

const Header = ({ usbConnected, onUSBManagerOpen }) => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">💰</div>
          <div className="logo-text">
            <h1>CAISSE ENREGISTREUSE</h1>
            <span className="version">V2.0</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="datetime">
          <div className="time">{currentTime}</div>
          <div className="date">{currentDate}</div>
        </div>
      </div>

      <div className="header-right">
        <div className="usb-status" onClick={onUSBManagerOpen}>
          <div className={`usb-indicator ${usbConnected ? 'connected' : 'disconnected'}`}>
            <div className="usb-icon">💾</div>
            <div className="usb-text">
              {usbConnected ? 'Clé USB Connectée' : 'Clé USB Déconnectée'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 