import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ServiceCard } from '../components/ServiceCard';

export const Home: React.FC = () => {
  const { products, services } = useApp();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
  const featuredServices = services.slice(0, 3);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gray-900 h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Elegance in Every Fold,<br/>Beauty in Every Touch
          </h1>
          <p className="text-xl text-rose-100 mb-8 font-light">
            Discover our exclusive collection of handpicked sarees and indulge in premium parlor services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="px-8 py-3 bg-rose-600 text-white font-semibold rounded hover:bg-rose-700 transition">
              Shop Sarees
            </Link>
            <Link to="/services" className="px-8 py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Sarees Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-rose-600 font-bold uppercase tracking-widest text-sm">New Arrivals</span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Trending Collections</h2>
          </div>
          <Link to="/shop" className="text-rose-700 font-semibold hover:text-rose-900">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Services Banner */}
      <section className="bg-rose-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Our Premium Services</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Relax and rejuvenate with our wide range of parlor services tailored just for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-block px-8 py-3 border-2 border-rose-600 text-rose-700 font-bold rounded hover:bg-rose-600 hover:text-white transition">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};