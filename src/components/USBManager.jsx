import React, { useState, useEffect } from 'react';
import './USBManager.css';

const USBManager = ({ onConnect, onSkip }) => {
  const [usbStatus, setUsbStatus] = useState('searching');
  const [usbPath, setUsbPath] = useState('');
  const [backupStatus, setBackupStatus] = useState('');

  useEffect(() => {
    // Simulation de détection USB
    setTimeout(() => {
      setUsbStatus('found');
      setUsbPath('E:\\Caisse_Enregistreuse_Data');
    }, 2000);
  }, []);

  const handleConnect = () => {
    setBackupStatus('importing');
    
    // Simulation d'import des données
    setTimeout(() => {
      setBackupStatus('success');
      setTimeout(() => {
        onConnect();
      }, 1000);
    }, 2000);
  };

  const handleSkip = () => {
    onSkip();
  };

  const renderUSBStatus = () => {
    switch (usbStatus) {
      case 'searching':
        return (
          <div className="usb-status searching">
            <div className="usb-icon">🔍</div>
            <h2>Recherche de clé USB...</h2>
            <p>Veuillez insérer votre clé USB de sauvegarde</p>
            <div className="loading-spinner"></div>
          </div>
        );
      
      case 'found':
        return (
          <div className="usb-status found">
            <div className="usb-icon">💾</div>
            <h2>Clé USB détectée !</h2>
            <p>Chemin: {usbPath}</p>
            <div className="usb-actions">
              <button onClick={handleConnect} className="connect-btn">
                Connecter et importer
              </button>
              <button onClick={handleSkip} className="skip-btn">
                Continuer sans clé USB
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderBackupStatus = () => {
    if (!backupStatus) return null;

    switch (backupStatus) {
      case 'importing':
        return (
          <div className="backup-status importing">
            <div className="backup-icon">📥</div>
            <h3>Import des données...</h3>
            <div className="loading-spinner"></div>
          </div>
        );
      
      case 'success':
        return (
          <div className="backup-status success">
            <div className="backup-icon">✅</div>
            <h3>Données importées avec succès !</h3>
            <p>Connexion en cours...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="usb-manager">
      <div className="usb-manager-content">
        <div className="usb-manager-header">
          <h1>🔐 Système de Sauvegarde Sécurisée</h1>
          <p>Votre caisse enregistreuse nécessite une clé USB pour la sauvegarde des données</p>
        </div>

        <div className="usb-manager-body">
          {renderUSBStatus()}
          {renderBackupStatus()}
        </div>

        <div className="usb-manager-footer">
          <div className="security-info">
            <h4>🔒 Sécurité Maximale</h4>
            <ul>
              <li>✅ Aucune trace sur l'ordinateur hôte</li>
              <li>✅ Toutes les données sur clé USB chiffrée</li>
              <li>✅ Double sauvegarde pour éviter la perte</li>
              <li>✅ Interface simple pour les employés</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USBManager; 