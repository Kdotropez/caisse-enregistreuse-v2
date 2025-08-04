import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DataContext = createContext();

// Types d'actions
const ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_PRODUCT_POSITION: 'UPDATE_PRODUCT_POSITION',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  REPLACE_PRODUCTS: 'REPLACE_PRODUCTS',
  MERGE_PRODUCTS: 'MERGE_PRODUCTS',
  UPDATE_CATEGORIES: 'UPDATE_CATEGORIES',
  MERGE_CATEGORIES: 'MERGE_CATEGORIES',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_VENTES: 'SET_VENTES',
  ADD_VENTE: 'ADD_VENTE',
  SET_RETOURS: 'SET_RETOURS',
  ADD_RETOUR: 'ADD_RETOUR',
  SET_CART: 'SET_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_USB_CONNECTED: 'SET_USB_CONNECTED',
  SET_LAST_BACKUP: 'SET_LAST_BACKUP',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_CURRENT_EMPLOYEE: 'SET_CURRENT_EMPLOYEE'
};

// État initial
const initialState = {
  products: [
    { id: 1, name: 'Pain baguette', price: 1.10, category: 'Alimentation', ean: '1234567890123' },
    { id: 2, name: 'Lait 1L', price: 1.20, category: 'Alimentation', ean: '1234567890124' },
    { id: 3, name: 'Coca-Cola 33cl', price: 1.50, category: 'Boissons', ean: '1234567890125' },
    { id: 4, name: 'Eau minérale 1.5L', price: 0.80, category: 'Boissons', ean: '1234567890126' },
    { id: 5, name: 'Shampoing', price: 3.50, category: 'Hygiène', ean: '1234567890127' },
    { id: 6, name: 'Dentifrice', price: 2.80, category: 'Hygiène', ean: '1234567890128' },
    { id: 7, name: 'Lessive 2L', price: 4.20, category: 'Entretien', ean: '1234567890129' },
    { id: 8, name: 'Papier toilette', price: 1.90, category: 'Entretien', ean: '1234567890130' },
    { id: 9, name: 'Pommes 1kg', price: 2.50, category: 'Alimentation', ean: '1234567890131' },
    { id: 10, name: 'Bananes 1kg', price: 1.80, category: 'Alimentation', ean: '1234567890132' }
  ],
  ventes: [],
  retours: [],
  cart: [],
  usbConnected: false,
  lastBackup: null,
  employees: [
    { id: 1, name: 'Employé 1', code: '1234' },
    { id: 2, name: 'Employé 2', code: '5678' }
  ],
  currentEmployee: null,
  categories: [
    'Alimentation',
    'Boissons',
    'Hygiène',
    'Entretien',
    'Autres'
  ]
};

// Reducer
function dataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };
    
    case ACTIONS.ADD_PRODUCT:
      return { 
        ...state, 
        products: [...state.products, { ...action.payload, id: Date.now() }] 
      };
    
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case ACTIONS.UPDATE_PRODUCT_POSITION:
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? { ...p, position: action.payload.position } : p
        )
      };
    
    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case ACTIONS.REPLACE_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    
    case ACTIONS.MERGE_PRODUCTS:
      // Créer un Map des produits existants basé sur nom+ean pour éviter les doublons
      const existingProductsMap = new Map();
      state.products.forEach(p => {
        const key = `${p.name.toLowerCase()}-${p.ean || ''}`;
        existingProductsMap.set(key, p);
      });
      
      // Filtrer les nouveaux produits pour éviter les doublons
      const newProducts = action.payload.filter(newProduct => {
        const key = `${newProduct.name.toLowerCase()}-${newProduct.ean || ''}`;
        return !existingProductsMap.has(key);
      });
      
      return {
        ...state,
        products: [...state.products, ...newProducts]
      };
    
    case ACTIONS.UPDATE_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    
    case ACTIONS.MERGE_CATEGORIES:
      const existingCategories = new Set(state.categories);
      const newCategories = action.payload.filter(cat => !existingCategories.has(cat));
      return {
        ...state,
        categories: [...state.categories, ...newCategories].sort()
      };
    
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        products: state.products.filter(p => p.category !== action.payload),
        categories: state.categories.filter(cat => cat !== action.payload)
      };
    
    case ACTIONS.SET_VENTES:
      return { ...state, ventes: action.payload };
    
    case ACTIONS.ADD_VENTE:
      try {
        const newVente = {
          ...action.payload,
          id: action.payload.id || Date.now(),
          date: action.payload.date || new Date().toISOString()
        };
        return { 
          ...state, 
          ventes: [...state.ventes, newVente] 
        };
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la vente:', error);
        return state;
      }
    
    case ACTIONS.SET_RETOURS:
      return { ...state, retours: action.payload };
    
    case ACTIONS.ADD_RETOUR:
      return { 
        ...state, 
        retours: [...state.retours, { ...action.payload, id: Date.now() }] 
      };
    
    case ACTIONS.SET_CART:
      return { ...state, cart: action.payload };
    
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case ACTIONS.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };
    
    case ACTIONS.SET_USB_CONNECTED:
      return { ...state, usbConnected: action.payload };
    
    case ACTIONS.SET_LAST_BACKUP:
      return { ...state, lastBackup: action.payload };
    
    case ACTIONS.SET_EMPLOYEES:
      return { ...state, employees: action.payload };
    
    case ACTIONS.SET_CURRENT_EMPLOYEE:
      return { ...state, currentEmployee: action.payload };
    
    default:
      return state;
  }
}

// Provider
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem('caisse_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.products) dispatch({ type: ACTIONS.SET_PRODUCTS, payload: parsedData.products });
        if (parsedData.ventes) dispatch({ type: ACTIONS.SET_VENTES, payload: parsedData.ventes });
        if (parsedData.retours) dispatch({ type: ACTIONS.SET_RETOURS, payload: parsedData.retours });
        if (parsedData.employees) dispatch({ type: ACTIONS.SET_EMPLOYEES, payload: parsedData.employees });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder les données dans le localStorage quand elles changent
  useEffect(() => {
    try {
      const dataToSave = {
        products: state.products,
        ventes: state.ventes,
        retours: state.retours,
        employees: state.employees,
        lastBackup: new Date().toISOString()
      };
      localStorage.setItem('caisse_data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  }, [state.products, state.ventes, state.retours, state.employees]);

  // Fonctions utilitaires
  const getProductById = (id) => {
    return state.products.find(p => p.id === id);
  };

  const getProductsByCategory = (category) => {
    return state.products.filter(p => p.category === category);
  };

  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return state.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.ean?.includes(query) ||
      p.attributes?.toLowerCase().includes(lowerQuery)
    );
  };

  const getVentesByDate = (date) => {
    return state.ventes.filter(v => 
      new Date(v.date).toDateString() === new Date(date).toDateString()
    );
  };

  const getVentesByPeriod = (startDate, endDate) => {
    return state.ventes.filter(v => {
      const venteDate = new Date(v.date);
      return venteDate >= startDate && venteDate <= endDate;
    });
  };

  const calculateTotalVentes = (ventes) => {
    return ventes.reduce((total, vente) => total + vente.total, 0);
  };

  const calculateCartTotal = () => {
    try {
      return state.cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Erreur lors du calcul du total:', error);
      return 0;
    }
  };

  const value = {
    ...state,
    dispatch,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getVentesByDate,
    getVentesByPeriod,
    calculateTotalVentes,
    calculateCartTotal,
    ACTIONS
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
} 