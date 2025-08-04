import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { importCSVFile } from '../utils/csvImporter';
import './CSVImporter.css';

const CSVImporter = ({ onClose }) => {
  const { dispatch, ACTIONS } = useData();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState({
    name: '',
    category: '',
    price: '',
    ean: '',
    wholesalePrice: '',
    originalPrice: '',
    discount: '',
    attributes: ''
  });

  const requiredFields = {
    name: 'Nom du produit',
    price: 'Prix de vente TTC final'
  };

  const optionalFields = {
    category: 'Catégorie',
    ean: 'Code EAN-13',
    wholesalePrice: 'Prix de gros',
    originalPrice: 'Prix barré TTC',
    discount: 'Montant de remise',
    attributes: 'Attributs'
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setError('');
      // Extraire les headers et proposer un mappage automatique
      extractHeadersAndMap(selectedFile);
    } else {
      setError('Veuillez sélectionner un fichier CSV valide');
      setFile(null);
      setPreview(null);
    }
  };

  const extractHeadersAndMap = async (selectedFile) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target.result;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(';').map(h => h.trim());
        
        setCsvHeaders(headers);
        
        // Mappage automatique optimisé pour votre structure CSV
        const autoMapping = {
          name: headers.find(h => h === 'Nom') || '',
          category: headers.find(h => h === 'Nom catégorie par défaut') || '',
          price: headers.find(h => h === 'Prix de vente TTC final') || '',
          ean: headers.find(h => h === 'ean13') || '',
          wholesalePrice: headers.find(h => h === 'wholesale_price') || '',
          originalPrice: headers.find(h => h === 'Prix barré TTC') || '',
          discount: headers.find(h => h === 'Montant de la remise') || '',
          attributes: headers.find(h => h === 'Liste catégories associées (IDs)') || ''
        };
        
        // Vérification et diagnostic du mappage
        console.log('🔍 DIAGNOSTIC DU MAPPAGE CSV:');
        console.log('Headers trouvés:', headers);
        console.log('Mappage automatique:', autoMapping);
        
        // Vérifier si tous les champs obligatoires sont trouvés
        const missingRequired = [];
        if (!autoMapping.name) missingRequired.push('Nom');
        if (!autoMapping.price) missingRequired.push('Prix de vente TTC final');
        
        if (missingRequired.length > 0) {
          console.warn('⚠️ Champs obligatoires manquants:', missingRequired);
        } else {
          console.log('✅ Tous les champs obligatoires trouvés');
        }
        
        // Vérifier les champs optionnels
        const foundOptional = [];
        if (autoMapping.category) foundOptional.push('Catégorie');
        if (autoMapping.ean) foundOptional.push('EAN-13');
        if (autoMapping.wholesalePrice) foundOptional.push('Prix de gros');
        if (autoMapping.originalPrice) foundOptional.push('Prix barré');
        if (autoMapping.discount) foundOptional.push('Remise');
        if (autoMapping.attributes) foundOptional.push('Attributs');
        
        console.log('📋 Champs optionnels trouvés:', foundOptional);
        
        setMapping(autoMapping);
        setShowMapping(true);
      };
      reader.readAsText(selectedFile, 'ISO-8859-1');
    } catch (error) {
      setError('Erreur lors de la lecture des headers');
    }
  };

  const handleMappingChange = (field, value) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateMapping = () => {
    const missingRequired = Object.entries(requiredFields)
      .filter(([field]) => !mapping[field])
      .map(([, label]) => label);
    
    if (missingRequired.length > 0) {
      setError(`Champs obligatoires manquants : ${missingRequired.join(', ')}`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleMappingConfirm = async () => {
    if (!validateMapping()) return;
    
    setShowMapping(false);
    setLoading(true);
    
    try {
      const { products, categories } = await importCSVFile(file, mapping);
      setPreview({
        totalProducts: products.length,
        categories: categories.length,
        sampleProducts: products.slice(0, 5),
        allCategories: categories
      });
    } catch (error) {
      setError('Erreur lors de la prévisualisation du fichier');
    } finally {
      setLoading(false);
    }
  };

  const previewFile = async (selectedFile) => {
    try {
      const { products, categories } = await importCSVFile(selectedFile, mapping);
      setPreview({
        totalProducts: products.length,
        categories: categories.length,
        sampleProducts: products.slice(0, 5),
        allCategories: categories
      });
    } catch (error) {
      setError('Erreur lors de la prévisualisation du fichier');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const { products, categories } = await importCSVFile(file, mapping);
      
      // Remplacer les produits existants
      dispatch({ type: ACTIONS.REPLACE_PRODUCTS, payload: products });
      
      // Mettre à jour les catégories
      dispatch({ type: ACTIONS.UPDATE_CATEGORIES, payload: categories });
      
      alert(`Import réussi ! ${products.length} produits importés, ${categories.length} catégories trouvées.`);
      onClose();
    } catch (error) {
      setError('Erreur lors de l\'import : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const { products, categories } = await importCSVFile(file, mapping);
      
      // Ajouter les nouveaux produits sans remplacer les existants
      dispatch({ type: ACTIONS.MERGE_PRODUCTS, payload: products });
      
      // Fusionner les catégories
      dispatch({ type: ACTIONS.MERGE_CATEGORIES, payload: categories });
      
      alert(`Fusion réussie ! ${products.length} produits ajoutés.`);
      onClose();
    } catch (error) {
      setError('Erreur lors de la fusion : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showMapping) {
    return (
      <div className="csv-importer-overlay">
        <div className="csv-importer-modal">
          <div className="csv-importer-header">
            <h2>Configuration du Mappage CSV</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>

          <div className="csv-importer-content">
            <div className="mapping-section">
              <p className="mapping-intro">
                Sélectionnez quelle colonne de votre fichier CSV correspond à chaque champ de l'application :
              </p>

              <div className="mapping-fields">
                <h3>Champs obligatoires</h3>
                {Object.entries(requiredFields).map(([field, label]) => (
                  <div key={field} className="mapping-field">
                    <label htmlFor={`mapping-${field}`}>{label} *</label>
                    <select
                      id={`mapping-${field}`}
                      value={mapping[field]}
                      onChange={(e) => handleMappingChange(field, e.target.value)}
                      required
                    >
                      <option value="">Sélectionner une colonne</option>
                      {csvHeaders.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <h3>Champs optionnels</h3>
                {Object.entries(optionalFields).map(([field, label]) => (
                  <div key={field} className="mapping-field">
                    <label htmlFor={`mapping-${field}`}>{label}</label>
                    <select
                      id={`mapping-${field}`}
                      value={mapping[field]}
                      onChange={(e) => handleMappingChange(field, e.target.value)}
                    >
                      <option value="">Aucune colonne</option>
                      {csvHeaders.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="mapping-actions">
                <button
                  onClick={handleMappingConfirm}
                  disabled={loading}
                  className="mapping-confirm-btn"
                >
                  {loading ? 'Configuration...' : 'Confirmer le mappage'}
                </button>
                <button
                  onClick={() => setShowMapping(false)}
                  className="mapping-cancel-btn"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="csv-importer-overlay">
      <div className="csv-importer-modal">
        <div className="csv-importer-header">
          <h2>Importer la Base de Données CSV</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="csv-importer-content">
          <div className="file-upload-section">
            <label htmlFor="csv-file" className="file-upload-label">
              <div 
                className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span className="upload-icon">📁</span>
                <span>Cliquez pour sélectionner un fichier CSV</span>
                <span className="file-hint">ou glissez-déposez le fichier ici</span>
              </div>
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {file && (
            <div className="file-info">
              <p><strong>Fichier sélectionné :</strong> {file.name}</p>
              <p><strong>Taille :</strong> {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {preview && (
            <div className="preview-section">
              <h3>Aperçu de l'import</h3>
              <div className="preview-stats">
                <div className="stat-item">
                  <span className="stat-label">Produits :</span>
                  <span className="stat-value">{preview.totalProducts}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Catégories :</span>
                  <span className="stat-value">{preview.categories}</span>
                </div>
              </div>

              <div className="sample-products">
                <h4>Exemples de produits :</h4>
                <div className="product-list">
                  {preview.sampleProducts.map((product, index) => (
                    <div key={index} className="product-item">
                      <div className="product-main-info">
                        <span className="product-name">{product.name}</span>
                        <span className="product-category">{product.category}</span>
                      </div>
                      <div className="product-prices">
                        <span className="product-price">Prix: {product.price.toFixed(2)}€</span>
                        {product.originalPrice > 0 && (
                          <span className="product-original-price">Barré: {product.originalPrice.toFixed(2)}€</span>
                        )}
                        {product.wholesalePrice > 0 && (
                          <span className="product-wholesale">Achat: {product.wholesalePrice.toFixed(2)}€</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="categories-preview">
                <h4>Catégories trouvées :</h4>
                <div className="categories-list">
                  {preview.allCategories.slice(0, 10).map((category, index) => (
                    <span key={index} className="category-tag">{category}</span>
                  ))}
                  {preview.allCategories.length > 10 && (
                    <span className="category-more">... et {preview.allCategories.length - 10} autres</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {preview && (
            <div className="import-actions">
              <button
                onClick={() => setShowDiagnostic(!showDiagnostic)}
                className="diagnostic-btn"
              >
                🔍 Diagnostic détaillé
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="import-btn replace-btn"
              >
                {loading ? 'Import en cours...' : 'Remplacer tous les produits'}
              </button>
              <button
                onClick={handleMerge}
                disabled={loading}
                className="import-btn merge-btn"
              >
                {loading ? 'Fusion en cours...' : 'Fusionner avec les produits existants'}
              </button>
            </div>
          )}

                     {showDiagnostic && preview && (
             <div className="diagnostic-section">
               <h4>🔍 Diagnostic détaillé de l'import</h4>
               <div className="diagnostic-content">
                 <div className="diagnostic-item">
                   <strong>📊 Statistiques :</strong>
                   <ul>
                     <li>Total produits détectés : <strong>{preview.totalProducts}</strong></li>
                     <li>Catégories trouvées : <strong>{preview.categories}</strong></li>
                     <li>Fichier CSV : <strong>{file?.name}</strong></li>
                     <li>Taille : <strong>{(file?.size / 1024).toFixed(2)} KB</strong></li>
                   </ul>
                 </div>
                 
                 <div className="diagnostic-item">
                   <strong>🎯 Mappage des colonnes :</strong>
                   <div className="mapping-diagnostic">
                     <div className="mapping-row">
                       <span className="mapping-field">Nom du produit :</span>
                       <span className="mapping-value">{mapping.name || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Catégorie :</span>
                       <span className="mapping-value">{mapping.category || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Prix de vente :</span>
                       <span className="mapping-value">{mapping.price || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Code EAN-13 :</span>
                       <span className="mapping-value">{mapping.ean || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Prix de gros :</span>
                       <span className="mapping-value">{mapping.wholesalePrice || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Prix barré :</span>
                       <span className="mapping-value">{mapping.originalPrice || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Remise :</span>
                       <span className="mapping-value">{mapping.discount || '❌ Non mappé'}</span>
                     </div>
                     <div className="mapping-row">
                       <span className="mapping-field">Attributs :</span>
                       <span className="mapping-value">{mapping.attributes || '❌ Non mappé'}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="diagnostic-item">
                   <strong>📋 Données importées :</strong>
                   <ul>
                     <li>✅ Nom du produit (colonne: {mapping.name})</li>
                     <li>✅ Catégorie principale (colonne: {mapping.category})</li>
                     <li>✅ Code EAN-13 (colonne: {mapping.ean})</li>
                     <li>✅ Prix de vente TTC final (colonne: {mapping.price})</li>
                     <li>✅ Prix barré TTC (colonne: {mapping.originalPrice})</li>
                     <li>✅ Prix de gros (colonne: {mapping.wholesalePrice})</li>
                     <li>✅ Prix de vente HT (colonne: Prix de vente HT)</li>
                     <li>✅ Prix TTC avant remises (colonne: Prix de vente TTC avant remises)</li>
                     <li>✅ Montant de remise (colonne: {mapping.discount})</li>
                     <li>✅ Identifiant produit (colonne: Identifiant produit)</li>
                     <li>✅ Attributs et catégories (colonne: {mapping.attributes})</li>
                     <li>✅ Stock disponible (colonne: Quantité disponible à la vente)</li>
                     <li>✅ Déclinaisons (si présentes)</li>
                   </ul>
                 </div>
                 
                 <div className="diagnostic-item">
                   <strong>📝 Exemple de produit importé :</strong>
                   <pre className="product-example">{JSON.stringify(preview.sampleProducts[0], null, 2)}</pre>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CSVImporter; 