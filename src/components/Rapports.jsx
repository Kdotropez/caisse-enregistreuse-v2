import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Rapports.css';

const Rapports = () => {
  const { ventes, calculateTotalVentes, getVentesByDate, getVentesByPeriod } = useData();
  
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const getFilteredVentes = () => {
    switch (selectedPeriod) {
      case 'today':
        return getVentesByDate(today);
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return getVentesByPeriod(weekAgo, today);
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return getVentesByPeriod(monthAgo, today);
      case 'custom':
        if (startDate && endDate) {
          return getVentesByPeriod(new Date(startDate), new Date(endDate));
        }
        return [];
      default:
        return ventes;
    }
  };

  const filteredVentes = getFilteredVentes();
  const totalVentes = calculateTotalVentes(filteredVentes);

  const exportToCSV = () => {
    const headers = ['Date', 'Heure', 'Total', 'Mode de paiement', 'Employé', 'Articles'];
    const csvContent = [
      headers.join(','),
      ...filteredVentes.map(vente => [
        new Date(vente.date).toLocaleDateString('fr-FR'),
        new Date(vente.date).toLocaleTimeString('fr-FR'),
        vente.total.toFixed(2),
        vente.paymentMethod,
        vente.employee,
        vente.items.map(item => `${item.name} (${item.quantity})`).join('; ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_ventes_${todayString}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rapports-container">
      <div className="rapports-header">
        <h1>Rapports et Statistiques</h1>
        <button onClick={exportToCSV} className="export-btn">
          📊 Exporter CSV
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total des ventes</h3>
            <p className="stat-value">{totalVentes.toFixed(2)}€</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Nombre de ventes</h3>
            <p className="stat-value">{filteredVentes.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Moyenne par vente</h3>
            <p className="stat-value">
              {filteredVentes.length > 0 ? (totalVentes / filteredVentes.length).toFixed(2) : '0.00'}€
            </p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="period-filters">
          <button
            className={`period-btn ${selectedPeriod === 'today' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('today')}
          >
            Aujourd'hui
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Cette semaine
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Ce mois
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'custom' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('custom')}
          >
            Période personnalisée
          </button>
        </div>

        {selectedPeriod === 'custom' && (
          <div className="custom-date-filters">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span>à</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        )}
      </div>

      <div className="ventes-table">
        <h2>Historique des ventes</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Total</th>
              <th>Mode de paiement</th>
              <th>Employé</th>
              <th>Articles</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentes.map(vente => (
              <tr key={vente.id}>
                <td>{new Date(vente.date).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(vente.date).toLocaleTimeString('fr-FR')}</td>
                <td>{vente.total.toFixed(2)}€</td>
                <td>
                  <span className={`payment-badge ${vente.paymentMethod}`}>
                    {vente.paymentMethod === 'especes' && '💰'}
                    {vente.paymentMethod === 'carte' && '💳'}
                    {vente.paymentMethod === 'cheque' && '📄'}
                    {vente.paymentMethod}
                  </span>
                </td>
                <td>{vente.employee}</td>
                <td className="items-cell">
                  {vente.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rapports; 