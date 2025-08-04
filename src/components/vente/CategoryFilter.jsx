import React, { useState } from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  const [showCategories, setShowCategories] = useState(true);

  return (
    <div className="category-filter">
      <div className="category-header">
        <button
          className="toggle-categories-btn"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? 'Masquer' : 'Afficher'} les catégories
        </button>
      </div>
      
      {showCategories && (
        <div className="category-buttons">
          <button
            className={`category-btn ${selectedCategory === 'Toutes' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Toutes')}
          >
            Toutes
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 