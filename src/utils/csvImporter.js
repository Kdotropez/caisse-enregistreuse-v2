/**
 * Utilitaire pour importer et parser le fichier CSV de la base de données
 */

// Fonction pour normaliser les noms de colonnes
const normalizeHeader = (header) => {
  return header
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ûüù]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
};

export const parseCSVData = (csvContent, mapping = {}) => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(';').map(h => h.trim());
  
  console.log('Headers détectés:', headers); // Diagnostic
  console.log('Mappage utilisé:', mapping); // Diagnostic
  
  const products = [];
  let skippedCount = 0;
  const existingKeys = new Set(); // Pour éviter les doublons
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(';');
    const product = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      product[header.trim()] = value.trim();
    });
    
    // Vérifier que le produit a les données essentielles
    const nameValue = product[mapping.name];
    const priceValue = product[mapping.price];
    
    if (nameValue && priceValue) {
      // Créer une clé unique basée sur le nom et l'EAN
      const eanValue = product[mapping.ean] || '';
      const uniqueKey = `${nameValue.toLowerCase()}-${eanValue}`;
      
      // Vérifier si ce produit existe déjà
      if (existingKeys.has(uniqueKey)) {
        console.log(`Produit en double ignoré: ${nameValue} (${eanValue})`);
        skippedCount++;
        continue;
      }
      
      existingKeys.add(uniqueKey);
      
      // Utiliser le mappage pour extraire les données
      const parsedProduct = {
        id: `prod_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        name: nameValue,
        category: product[mapping.category] || 'Autres',
        ean: eanValue,
        price: parseFloat(priceValue.replace(',', '.')) || 0,
        wholesalePrice: parseFloat(product[mapping.wholesalePrice]?.replace(',', '.')) || 0,
        originalPrice: parseFloat(product[mapping.originalPrice]?.replace(',', '.')) || 0,
        discount: parseFloat(product[mapping.discount]?.replace(',', '.')) || 0,
        attributes: product[mapping.attributes] || '',
        // Données spécifiques de votre CSV
        productId: product['Identifiant produit'] || '',
        reference: product['Référence'] || '',
        variationId: product['Identifiant déclinaison'] || '',
        variationEan: product['ean13 décl.'] || '',
        variationReference: product['Référence déclinaison'] || '',
        supplierReference: product['Référence fournisseur'] || '',
        priceHT: parseFloat(product['Prix de vente HT']?.replace(',', '.')) || 0,
        priceBeforeDiscount: parseFloat(product['Prix de vente TTC avant remises']?.replace(',', '.')) || 0,
        impactPrice: product['Impact sur prix de vente (HT/TTC suivant PS version)'] || '',
        impactPriceTTC: parseFloat(product['Impact sur prix de vente TTC']?.replace(',', '.')) || 0,
        // Stock et disponibilité
        stock: parseInt(product['Quantité disponible à la vente']) || 0,
        isDefaultVariation: product['Déclinaison par défaut ?'] === '1' || false
      };
      
      if (i <= 3) { // Diagnostic pour les 3 premiers produits
        console.log(`Produit ${i}:`, {
          nom: parsedProduct.name,
          categorie: parsedProduct.category,
          prix: parsedProduct.price,
          attributs: parsedProduct.attributes
        });
      }
      
      products.push(parsedProduct);
    } else {
      skippedCount++;
      if (skippedCount <= 5) {
        console.log('Produit ignoré:', product); // Diagnostic des produits ignorés
      }
    }
  }
  
  console.log(`Import terminé: ${products.length} produits importés, ${skippedCount} ignorés`);
  console.log('Exemple de produit importé:', products[0]); // Diagnostic
  
  // Diagnostic des catégories
  const sampleCategories = products.slice(0, 10).map(p => p.category);
  console.log('Exemples de catégories (10 premiers produits):', sampleCategories);
  
  return products;
};

export const extractCategories = (products) => {
  const categories = new Set();
  const categoryCounts = {};
  
  products.forEach(product => {
    // Ajouter la catégorie principale
    if (product.category) {
      categories.add(product.category);
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
    
    // Extraire les catégories depuis les attributs (Liste catégories associées)
    if (product.attributes) {
      const attributeCategories = product.attributes.split(',').map(cat => cat.trim());
      attributeCategories.forEach(cat => {
        if (cat && cat !== product.category) {
          categories.add(cat);
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });
    }
  });
  
  const sortedCategories = Array.from(categories).sort();
  console.log('Catégories trouvées:', sortedCategories); // Diagnostic
  console.log('Comptage par catégorie:', categoryCounts); // Diagnostic détaillé
  console.log('Exemples de catégories des premiers produits:', products.slice(0, 10).map(p => p.category)); // Diagnostic
  
  return sortedCategories;
};

export const importCSVFile = async (file, mapping = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        console.log('Contenu CSV lu, longueur:', csvContent.length); // Diagnostic
        console.log('Premières lignes:', csvContent.split('\n').slice(0, 3)); // Diagnostic
        
        const products = parseCSVData(csvContent, mapping);
        const categories = extractCategories(products);
        
        resolve({ products, categories });
      } catch (error) {
        console.error('Erreur lors du parsing:', error); // Diagnostic
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    // Essayer différents encodages
    reader.readAsText(file, 'ISO-8859-1');
  });
};

export const exportProductsToCSV = (products) => {
  const headers = [
    'Nom',
    'Nom catégorie par défaut',
    'ean13',
    'Prix de vente TTC final',
    'Prix barré TTC',
    'Montant de la remise',
    'Prix de vente HT',
    'Prix de vente TTC avant remises',
    'Prix de gros',
    'Identifiant produit',
    'Liste des attributs'
  ];
  
  const csvContent = [
    headers.join(';'),
    ...products.map(product => [
      product.name,
      product.category,
      product.ean,
      product.price.toString().replace('.', ','),
      product.originalPrice.toString().replace('.', ','),
      product.discount.toString().replace('.', ','),
      product.priceHT.toString().replace('.', ','),
      product.priceBeforeDiscount.toString().replace('.', ','),
      product.wholesalePrice.toString().replace('.', ','),
      product.productId,
      product.attributes
    ].join(';'))
  ].join('\n');
  
  return csvContent;
}; 