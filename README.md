# 💰 Caisse Enregistreuse V2

Une caisse enregistreuse moderne et sécurisée développée avec React, conçue pour une utilisation professionnelle avec sauvegarde exclusive sur clé USB.

## 🎯 Fonctionnalités Principales

### 🛍️ Interface de Vente
- **Grille de produits** avec recherche par nom/catégorie
- **Panier d'achat** avec calcul automatique
- **Gestion des quantités** (+/-)
- **Affichage du total** en temps réel
- **Scanner de code-barres** intégré

### 💳 Système de Paiement
- **Paiement en espèces** avec calcul automatique du rendu
- **Paiement par carte bancaire**
- **Paiement par chèque**
- **Validation et finalisation** des ventes

### 📊 Rapports et Statistiques
- **Historique des ventes** journalières
- **Export CSV** des rapports
- **Statistiques de vente** par période
- **Compteur de ventes** quotidiennes

### 🔄 Gestion des Retours
- **Interface de retour** de produits
- **Calcul automatique** du remboursement
- **Historique des retours**
- **Validation des retours**

### 🛍️ Base de Données Produits
- **Gestion complète** des produits (nom, prix, catégorie, EAN)
- **Recherche par code-barres**
- **Gestion des catégories**
- **Prix modifiables**

### 🎨 Interface Utilisateur
- **Design moderne** avec gradients bleu/violet
- **Interface responsive**
- **Animations fluides**
- **Navigation intuitive**

## 🔐 Système de Sauvegarde Sécurisée

### 📁 Sauvegarde Exclusivement sur Clé USB
- ✅ **AUCUNE sauvegarde** en ligne ou cloud
- ✅ **Toutes les données** stockées uniquement sur clé USB
- ✅ **Pas de Local Storage** persistant
- ✅ **Pas de base de données** externe

### 🔒 Sécurité Renforcée
- **Clé USB codée/chiffrée** (à implémenter)
- **Double sauvegarde** sur la même clé
- **Protection contre la perte** de données
- **Accès sécurisé** aux données

### 💾 Fonctionnement Technique
- **Export automatique** vers clé USB
- **Import depuis clé USB** au démarrage
- **Synchronisation en temps réel**
- **Vérification d'intégrité** des données

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]

# Aller dans le dossier
cd caisse-enregistreuse-v2

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build
```

### Déploiement Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

## 📂 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Header.jsx      # En-tête avec logo et statut USB
│   ├── Navigation.jsx  # Navigation principale
│   ├── Vente.jsx       # Interface de vente
│   ├── Produits.jsx    # Gestion des produits
│   ├── Rapports.jsx    # Rapports et statistiques
│   ├── Retours.jsx     # Gestion des retours
│   ├── Parametres.jsx  # Paramètres de la caisse
│   └── USBManager.jsx  # Gestion de la clé USB
├── context/
│   └── DataContext.jsx # Contexte global des données
├── App.jsx             # Composant principal
└── main.jsx           # Point d'entrée
```

## 🎨 Design et Interface

### Couleurs
- **Primaire**: Gradient bleu/violet (#667eea → #764ba2)
- **Secondaire**: Gris neutre (#6b7280)
- **Succès**: Vert (#22c55e)
- **Erreur**: Rouge (#ef4444)
- **Avertissement**: Orange (#f59e0b)

### Responsive Design
- **Desktop**: Interface complète avec grille de produits
- **Tablet**: Adaptation de la grille
- **Mobile**: Interface tactile optimisée

## 🔧 Configuration

### Variables d'Environnement
```env
# Pour le déploiement Vercel
VITE_APP_TITLE=Caisse Enregistreuse V2
VITE_APP_VERSION=2.0.0
```

### Personnalisation
- **Logo**: Modifier le composant Header
- **Couleurs**: Ajuster les variables CSS dans App.css
- **Produits**: Ajouter via l'interface ou modifier le contexte

## 📊 Fonctionnalités Avancées

### Gestion des Employés
- **Système de connexion** par employé
- **Codes d'accès** personnalisés
- **Statistiques par vendeur**

### Export/Import de Données
- **Export JSON** complet des données
- **Import de sauvegarde**
- **Export CSV** des rapports

### Sécurité
- **Aucune trace locale** permanente
- **Sauvegarde USB** exclusive
- **Chiffrement des données** (à implémenter)

## 🚀 Roadmap

### Version 2.1
- [ ] **Chiffrement des données** USB
- [ ] **Authentification employés** complète
- [ ] **Impression de tickets**
- [ ] **Gestion des stocks**

### Version 2.2
- [ ] **Multi-boutiques**
- [ ] **Synchronisation cloud** (optionnel)
- [ ] **API REST** pour intégrations
- [ ] **Notifications push**

### Version 2.3
- [ ] **Analytics avancées**
- [ ] **Prévisions de vente**
- [ ] **Gestion des promotions**
- [ ] **Interface tactile** optimisée

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- **Email**: support@caisse-enregistreuse.com
- **Documentation**: [Lien vers la documentation]
- **Issues**: [Lien vers GitHub Issues]

---

## 🎯 Objectif Sécurité Maximale

Cette caisse enregistreuse est conçue pour être **100% autonome et sécurisée** :
- ✅ Aucune trace sur l'ordinateur hôte
- ✅ Toutes les données sur clé USB chiffrée
- ✅ Double sauvegarde pour éviter la perte
- ✅ Interface simple pour les employés
- ✅ Sécurité maximale pour les données financières

C'est un système de caisse **"nomade"** qui peut être utilisé sur n'importe quel ordinateur sans laisser de traces.

---

**Développé avec ❤️ pour une gestion de caisse moderne et sécurisée**
