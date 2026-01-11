import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';

interface Props {
  service: Service;
}

export const ServiceCard: React.FC<Props> = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-rose-100 hover:border-rose-300 transition-all">
      <div className="h-48 overflow-hidden">
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-bold text-gray-900">{service.name}</h3>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{service.duration}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-rose-700">₹{service.price.toLocaleString()}</span>
          <Link 
            to={`/book/${service.id}`}
            className="inline-block px-4 py-2 border border-rose-600 text-rose-600 hover:bg-rose-50 rounded text-sm font-medium transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};