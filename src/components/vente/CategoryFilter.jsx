import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="category-filter">
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
  );
};

export default CategoryFilter; 