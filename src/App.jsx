import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import VenteModular from './components/vente/VenteModular';
import ProduitsModular from './components/produits/ProduitsModular';
import Rapports from './components/Rapports';
import Retours from './components/Retours';
import Parametres from './components/Parametres';
import USBManager from './components/USBManager';
import CSVImporter from './components/CSVImporter';
import { DataProvider } from './context/DataContext';
import { DiscountProvider } from './context/DiscountContext';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('vente');
  const [usbConnected, setUsbConnected] = useState(false);
  const [showUSBManager, setShowUSBManager] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);

  // Simuler la connexion USB (à remplacer par la vraie logique USB)
  useEffect(() => {
    const checkUSBConnection = () => {
      // Simulation - à remplacer par la vraie détection USB
      setUsbConnected(Math.random() > 0.5);
    };

    checkUSBConnection();
    const interval = setInterval(checkUSBConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleUSBManagerOpen = () => {
    setShowUSBManager(true);
  };

  const handleUSBManagerClose = () => {
    setShowUSBManager(false);
  };

  const handleCSVImporterOpen = () => {
    setShowCSVImporter(true);
  };

  const handleCSVImporterClose = () => {
    setShowCSVImporter(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'vente':
        return <VenteModular />;
      case 'produits':
        return <ProduitsModular onCSVImport={handleCSVImporterOpen} />;
      case 'rapports':
        return <Rapports />;
      case 'retours':
        return <Retours />;
      case 'parametres':
        return <Parametres />;
      default:
        return <VenteModular />;
    }
  };

  return (
    <DataProvider>
      <DiscountProvider>
        <div className="app">
          <Header 
            usbConnected={usbConnected} 
            onUSBManagerOpen={handleUSBManagerOpen} 
          />
          
          <Navigation 
            currentView={currentView} 
            onViewChange={handleViewChange} 
          />
          
          <main className="main-content">
            {renderCurrentView()}
          </main>

          {/* Modals */}
          {showUSBManager && (
            <USBManager 
              isOpen={showUSBManager} 
              onClose={handleUSBManagerClose}
              usbConnected={usbConnected}
              setUsbConnected={setUsbConnected}
            />
          )}

          {showCSVImporter && (
            <CSVImporter 
              isOpen={showCSVImporter} 
              onClose={handleCSVImporterClose}
            />
          )}
        </div>
      </DiscountProvider>
    </DataProvider>
  );
}

export default App;
