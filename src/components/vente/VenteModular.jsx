import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import ProductSearch from './ProductSearch';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';
import PaymentModal from './PaymentModal';
import DiscountModal from './DiscountModal';
import TicketGenerator from './TicketGenerator';
import './VenteModular.css';

const VenteModular = () => {
  const { 
    products, 
    cart, 
    categories,
    dispatch, 
    searchProducts, 
    getProductsByCategory,
    calculateCartTotal,
    ACTIONS 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [lastVente, setLastVente] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [currentDiscount, setCurrentDiscount] = useState(null);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  // Réinitialiser la recherche quand on change de catégorie
  useEffect(() => {
    setSearchQuery('');
  }, [selectedCategory]);

  const filterProducts = () => {
    let filtered = products;

    // D'abord filtrer par catégorie
    if (selectedCategory !== 'Toutes') {
      filtered = getProductsByCategory(selectedCategory);
    }

    // Ensuite appliquer la recherche sur les produits filtrés par catégorie
    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery).filter(product => 
        selectedCategory === 'Toutes' || product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
    } else {
      dispatch({ type: ACTIONS.UPDATE_CART_QUANTITY, payload: { id: productId, quantity } });
    }
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      const product = products.find(p => p.ean === barcodeInput.trim());
      if (product) {
        addToCart(product);
        setBarcodeInput('');
      } else {
        alert('Produit non trouvé');
      }
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }
    setShowPayment(true);
  };

  const handleDiscount = () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }
    setShowDiscount(true);
  };

  const applyDiscount = (discountData) => {
    setCurrentDiscount(discountData);
  };

  const calculateDiscountedTotal = () => {
    const baseTotal = calculateCartTotal();
    if (currentDiscount) {
      return baseTotal - currentDiscount.amount;
    }
    return baseTotal;
  };

  const processPayment = () => {
    try {
      if (!paymentMethod) {
        alert('Veuillez sélectionner un mode de paiement');
        return;
      }

      const total = calculateCartTotal();
      let change = 0;

      if (paymentMethod === 'especes') {
        const received = parseFloat(amountReceived);
        if (isNaN(received) || received < total) {
          alert('Montant insuffisant ou invalide');
          return;
        }
        change = received - total;
      }

      const vente = {
        id: Date.now(), // Ajouter un ID unique
        date: new Date().toISOString(),
        items: [...cart], // Copie profonde du panier
        total: total,
        discount: currentDiscount ? { ...currentDiscount } : null, // Copie de la remise
        paymentMethod: paymentMethod,
        amountReceived: paymentMethod === 'especes' ? parseFloat(amountReceived) : total,
        change: change,
        employee: 'Employé 1' // À connecter avec le système d'employés
      };

      // Sauvegarder la vente
      dispatch({ type: ACTIONS.ADD_VENTE, payload: vente });
      
      // Vider le panier
      dispatch({ type: ACTIONS.CLEAR_CART });

      // Réinitialiser l'interface
      setShowPayment(false);
      setPaymentMethod('');
      setAmountReceived('');
      setCurrentDiscount(null);
      
      // Afficher le ticket
      setLastVente(vente);
      setShowTicket(true);

      // Sauvegarder immédiatement dans localStorage
      const currentData = JSON.parse(localStorage.getItem('caisse_data') || '{}');
      const updatedVentes = [...(currentData.ventes || []), vente];
      localStorage.setItem('caisse_data', JSON.stringify({
        ...currentData,
        ventes: updatedVentes
      }));

    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
    }
  };

  const cancelPayment = () => {
    setShowPayment(false);
    setPaymentMethod('');
    setAmountReceived('');
  };

  const closeTicket = () => {
    setShowTicket(false);
    setLastVente(null);
  };

  return (
    <div className="vente-container">
      <div className="vente-left">
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          barcodeInput={barcodeInput}
          setBarcodeInput={setBarcodeInput}
          handleBarcodeSubmit={handleBarcodeSubmit}
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductGrid
          filteredProducts={filteredProducts}
          addToCart={addToCart}
        />
      </div>

      <div className="vente-right">
        <ShoppingCart
          cart={cart}
          calculateCartTotal={calculateDiscountedTotal}
          updateQuantity={updateQuantity}
          handlePayment={handlePayment}
          handleDiscount={handleDiscount}
          currentDiscount={currentDiscount}
        />
      </div>

      <PaymentModal
        showPayment={showPayment}
        onClose={cancelPayment}
        onConfirm={processPayment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        amountReceived={amountReceived}
        setAmountReceived={setAmountReceived}
        total={calculateDiscountedTotal()}
      />

      <DiscountModal
        showDiscount={showDiscount}
        onClose={() => setShowDiscount(false)}
        cart={cart}
        calculateCartTotal={calculateCartTotal}
        applyDiscount={applyDiscount}
      />

      {showTicket && lastVente && (
        <TicketGenerator
          vente={lastVente}
          onClose={closeTicket}
        />
      )}
    </div>
  );
};

export default VenteModular; 