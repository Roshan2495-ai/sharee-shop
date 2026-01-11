import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useApp();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-80 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
      </div>
      <div className="p-6">
        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">{product.category}</span>
        <h3 className="mt-1 text-xl font-serif font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded hover:bg-rose-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};