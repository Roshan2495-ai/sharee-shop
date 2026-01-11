import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ServiceDisplay: React.FC = () => {
  const { sareeServices } = useApp();

  return (
    <div className="min-h-screen bg-rose-50/50">
      {/* Hero Section */}
      <div className="relative bg-rose-900 h-80">
        <div className="absolute inset-0">
           <div className="absolute inset-0 bg-black opacity-40"></div>
           <img 
            src="https://images.unsplash.com/photo-1583391733958-d023e669968e?q=80&w=2000&auto=format&fit=crop" 
            alt="Saree Texture" 
            className="w-full h-full object-cover" 
           />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">RuChiRa Saree Services</h1>
            <p className="text-rose-100 text-lg max-w-2xl">
                Expert care for your sarees. Choose a service below to book an appointment. 
                Bring your saree, and we'll handle the rest.
            </p>
        </div>
      </div>

      {/* Service Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {sareeServices.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500">
                    No services currently available. Please check back later.
                </div>
            )}
            
            {sareeServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
                    <div className="h-64 overflow-hidden relative group">
                        <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {service.status}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">{service.name}</h2>
                        <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                        
                        <div className="border-t pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Price Range</p>
                                <p className="text-xl font-bold text-rose-600">{service.price_range}</p>
                            </div>
                            
                            {service.status === 'Active' ? (
                                <Link 
                                    to={`/book-appointment/${service.id}`}
                                    className="bg-rose-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-rose-700 transition shadow transform hover:-translate-y-0.5"
                                >
                                    Book Appointment
                                </Link>
                            ) : (
                                <button disabled className="bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-bold cursor-not-allowed">
                                    Unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-16 text-center text-gray-500 text-sm">
            <p>Note: We provide the folding/pleating service only. Please bring your own saree to the appointment.</p>
        </div>
      </div>
    </div>
  );
};