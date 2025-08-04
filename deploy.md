# 🚀 Guide de Déploiement Vercel

## 📋 Prérequis

1. **Compte Vercel** : Créer un compte sur [vercel.com](https://vercel.com)
2. **Vercel CLI** : Installer la CLI Vercel
3. **Projet Git** : Avoir le projet sur GitHub/GitLab/Bitbucket

## 🔧 Installation de Vercel CLI

```bash
# Installation globale
npm i -g vercel

# Ou avec yarn
yarn global add vercel
```

## 🚀 Déploiement Automatique

### Option 1 : Via GitHub (Recommandé)

1. **Pousser le code** sur GitHub
2. **Connecter le repo** à Vercel
3. **Déploiement automatique** à chaque push

### Option 2 : Via Vercel CLI

```bash
# Se connecter à Vercel
vercel login

# Déployer depuis le dossier du projet
cd caisse-enregistreuse-v2
vercel

# Suivre les instructions
# - Sélectionner le scope
# - Confirmer le nom du projet
# - Choisir les paramètres
```

## ⚙️ Configuration

### Variables d'Environnement

Dans le dashboard Vercel, ajouter :

```env
VITE_APP_TITLE=Caisse Enregistreuse V2
VITE_APP_VERSION=2.0.0
```

### Domaine Personnalisé (Optionnel)

1. **Acheter un domaine** (ex: caisse-enregistreuse.com)
2. **Configurer les DNS** selon les instructions Vercel
3. **Ajouter le domaine** dans les paramètres du projet

## 🔄 Déploiement Manuel

```bash
# Build de production
npm run build

# Déploiement
vercel --prod
```

## 📊 Monitoring

### Analytics Vercel
- **Visiteurs** : Nombre de visiteurs uniques
- **Performance** : Temps de chargement
- **Erreurs** : Logs d'erreurs en temps réel

### Logs
```bash
# Voir les logs en temps réel
vercel logs

# Logs d'une fonction spécifique
vercel logs --function=api/function-name
```

## 🔒 Sécurité

### Headers de Sécurité
Le fichier `vercel.json` inclut déjà :
- **SPA Routing** : Redirection vers index.html
- **CORS** : Configuration pour les API
- **HTTPS** : Forcé automatiquement

### Variables Sensibles
```bash
# Ajouter des variables secrètes
vercel env add VITE_API_KEY

# Variables pour la production uniquement
vercel env add VITE_API_KEY production
```

## 🚨 Troubleshooting

### Erreur de Build
```bash
# Voir les logs de build
vercel logs --build

# Build local pour tester
npm run build
```

### Erreur 404
- Vérifier le fichier `vercel.json`
- S'assurer que `index.html` existe dans `dist/`
- Vérifier les routes dans la configuration

### Problème de Performance
- **Optimiser les images** : Utiliser des formats modernes (WebP)
- **Code splitting** : Diviser le bundle JavaScript
- **Lazy loading** : Charger les composants à la demande

## 📱 PWA (Progressive Web App)

Pour transformer en PWA :

1. **Ajouter un manifest** : `public/manifest.json`
2. **Service Worker** : `public/sw.js`
3. **Icons** : Différentes tailles dans `public/`

## 🔄 Mise à Jour

### Déploiement Automatique
- Chaque push sur `main` déclenche un déploiement
- Les previews sont créées pour les PR

### Rollback
```bash
# Revenir à une version précédente
vercel rollback

# Voir l'historique des déploiements
vercel ls
```

## 📈 Optimisations

### Performance
- **Compression** : Gzip automatique
- **CDN** : Distribution globale
- **Caching** : Headers optimisés

### SEO
- **Meta tags** : Dans `index.html`
- **Sitemap** : Générer automatiquement
- **Robots.txt** : Configurer selon les besoins

## 🎯 Checklist de Déploiement

- [ ] **Code testé** localement
- [ ] **Build réussi** (`npm run build`)
- [ ] **Variables d'environnement** configurées
- [ ] **Domaine** configuré (si nécessaire)
- [ ] **HTTPS** activé
- [ ] **Analytics** configurées
- [ ] **Monitoring** en place
- [ ] **Backup** des données

## 📞 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Community** : [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support** : [vercel.com/support](https://vercel.com/support)

---

**🎉 Votre caisse enregistreuse est maintenant déployée et accessible en ligne !** 