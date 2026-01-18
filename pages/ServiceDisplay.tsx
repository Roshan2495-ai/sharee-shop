import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ServiceDisplay: React.FC = () => {
  const { sareeServices } = useApp();

  return (
    <div className="min-h-screen bg-rose-50/50">
      {/* Hero Section */}
      <div className="relative bg-rose-900 h-96 overflow-hidden">
        <div className="absolute inset-0">
           {/* Darker gradient overlay for better text readability */}
           <div className="absolute inset-0 bg-gradient-to-r from-rose-950 via-rose-900/80 to-rose-900/40 opacity-90 z-10"></div>
           {/* High Quality Traditional Saree Background - Vibrant & Premium */}
           <img 
            src="https://images.unsplash.com/photo-1610030469668-9653612d6a50?q=80&w=2000&auto=format&fit=crop" 
            alt="Royal Saree Texture" 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
                e.currentTarget.src = "https://placehold.co/1200x400/881337/FFFFFF?text=RuChiRa+Services";
            }}
           />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-left">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
              Perfect Pleats, <br/>
              <span className="text-rose-200">Effortless Drapes</span>
            </h1>
            <p className="text-rose-50 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed drop-shadow">
                Experience the art of saree pre-pleating. We fold and pleat your sarees to perfection, 
                so you can drape them in under a minute.
            </p>
            <Link 
                to="/book-appointment/srv-fold-01"
                className="bg-white text-rose-900 hover:bg-rose-50 px-8 py-3 rounded-full font-bold transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
                Book a Session 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </Link>
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
                <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 border border-rose-100 group">
                    <div className="h-64 md:h-72 overflow-hidden relative bg-gray-100">
                        {service.image ? (
                            <img 
                                src={service.image} 
                                alt={service.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center bg-rose-100 text-rose-800 font-bold text-xl">
                                {service.name}
                            </div>
                        )}
                        {/* Fallback Element */}
                        <div className="hidden w-full h-full absolute inset-0 flex items-center justify-center bg-rose-100 text-rose-800 font-bold text-xl">
                            {service.name}
                        </div>

                        <div className="absolute top-4 right-4 z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${service.status === 'Active' ? 'bg-white/90 text-green-700 backdrop-blur-sm' : 'bg-red-100 text-red-800'}`}>
                                {service.status}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex-grow flex flex-col relative">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 group-hover:text-rose-700 transition-colors">{service.name}</h2>
                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
                        
                        <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Service Cost</p>
                                <p className="text-xl font-bold text-rose-600">{service.price_range}</p>
                            </div>
                            
                            {service.status === 'Active' ? (
                                <Link 
                                    to={`/book-appointment/${service.id}`}
                                    className="bg-rose-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full md:w-auto text-center"
                                >
                                    Book Now
                                </Link>
                            ) : (
                                <button disabled className="bg-gray-200 text-gray-400 px-6 py-3 rounded-lg font-bold cursor-not-allowed w-full md:w-auto">
                                    Unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-rose-100 text-center max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="p-4">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                    <p className="font-semibold text-gray-800">Book Online</p>
                    <p className="text-gray-500 mt-1">Select your service and choose a time slot.</p>
                </div>
                <div className="p-4">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                    <p className="font-semibold text-gray-800">Bring Saree</p>
                    <p className="text-gray-500 mt-1">Visit us with your saree at the scheduled time.</p>
                </div>
                <div className="p-4">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                    <p className="font-semibold text-gray-800">Done in Minutes</p>
                    <p className="text-gray-500 mt-1">Collect your perfectly pleated saree.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};