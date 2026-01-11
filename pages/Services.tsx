import React from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCard } from '../components/ServiceCard';

export const Services: React.FC = () => {
  const { services } = useApp();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Parlor Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book an appointment online and let our experts take care of your beauty needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};