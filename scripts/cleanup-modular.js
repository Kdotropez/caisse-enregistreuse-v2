#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Liste des fichiers à supprimer après vérification
const filesToRemove = [
  'src/components/Vente.jsx',
  'src/components/Vente.css',
  'src/components/Produits.jsx',
  'src/components/Produits.css'
];

// Liste des fichiers à vérifier avant suppression
const filesToCheck = [
  'src/components/Vente.jsx',
  'src/components/Produits.jsx'
];

console.log('🧹 Nettoyage des fichiers après démodularisation...\n');

// Vérifier que les nouveaux composants existent
const newComponents = [
  'src/components/vente/VenteModular.jsx',
  'src/components/produits/ProduitsModular.jsx'
];

let allNewComponentsExist = true;
for (const component of newComponents) {
  if (!fs.existsSync(component)) {
    console.log(`❌ Composant manquant: ${component}`);
    allNewComponentsExist = false;
  }
}

if (!allNewComponentsExist) {
  console.log('\n❌ Impossible de supprimer les anciens fichiers car les nouveaux composants ne sont pas tous présents.');
  process.exit(1);
}

// Vérifier que les anciens fichiers ne sont plus importés
let canRemove = true;
for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('import') || content.includes('export')) {
      console.log(`⚠️  Fichier ${file} contient encore des imports/exports`);
      canRemove = false;
    }
  }
}

if (!canRemove) {
  console.log('\n❌ Impossible de supprimer les fichiers car ils contiennent encore du code actif.');
  process.exit(1);
}

// Supprimer les fichiers
let removedCount = 0;
for (const file of filesToRemove) {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`✅ Supprimé: ${file}`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Erreur lors de la suppression de ${file}:`, error.message);
    }
  } else {
    console.log(`ℹ️  Fichier déjà supprimé: ${file}`);
  }
}

console.log(`\n🎉 Nettoyage terminé! ${removedCount} fichiers supprimés.`);
console.log('\n📁 Nouvelle structure:');
console.log('src/components/');
console.log('├── vente/');
console.log('│   ├── VenteModular.jsx');
console.log('│   ├── ProductSearch.jsx');
console.log('│   ├── CategoryFilter.jsx');
console.log('│   ├── ProductGrid.jsx');
console.log('│   ├── ShoppingCart.jsx');
console.log('│   └── PaymentModal.jsx');
console.log('└── produits/');
console.log('    ├── ProduitsModular.jsx');
console.log('    ├── ProductForm.jsx');
console.log('    ├── ProductFilters.jsx');
console.log('    └── ProductTable.jsx'); 