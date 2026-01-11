import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ServiceDisplay: React.FC = () => {
  const { sareeService } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-96">
        <div className="absolute inset-0">
            <img src={sareeService.image} alt="Saree Folding" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{sareeService.name}</h1>
            <p className="text-rose-100 text-xl max-w-2xl">{sareeService.description}</p>
        </div>
      </div>

      {/* Service Info */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img src={sareeService.image} alt="Service Detail" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${sareeService.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sareeService.status}
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                <p className="text-gray-600 mb-6">
                    We specialize in giving your saree the perfect fold and pleats. 
                    Whether it is box folding for compact storage or floppy pleating for that perfect drape, we handle your fabric with utmost care.
                </p>
                <div className="mb-8">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Service Price</p>
                    <p className="text-3xl font-bold text-rose-600">{sareeService.price_range}</p>
                </div>
                
                {sareeService.status === 'Active' ? (
                    <Link 
                        to="/book-appointment" 
                        className="block w-full text-center bg-rose-600 text-white font-bold py-4 rounded-lg hover:bg-rose-700 transition shadow-lg transform hover:-translate-y-0.5"
                    >
                        Book Appointment Now
                    </Link>
                ) : (
                    <button disabled className="block w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed">
                        Service Currently Unavailable
                    </button>
                )}
                <p className="text-xs text-gray-400 text-center mt-3">
                    * You bring the saree, we provide the service.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};