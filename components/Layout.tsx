import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-rose-600 font-bold' : 'text-gray-600 hover:text-rose-600';

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-700">RuChiRaa</span>
              <span className="hidden sm:inline-block text-sm uppercase tracking-widest text-gray-500 mt-2">Services</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Our Service</Link>
              <Link to="/book-appointment/srv-fold-01" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition font-medium">Book Appointment</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-rose-600 p-2 focus:outline-none"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 z-50 animate-in slide-in-from-top-2 duration-200">
             <div className="px-6 py-6 space-y-4 flex flex-col">
                <Link 
                  to="/" 
                  className={`text-lg font-medium block py-2 ${location.pathname === '/' ? 'text-rose-600' : 'text-gray-700'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Services
                </Link>
                <Link 
                  to="/book-appointment/srv-fold-01" 
                  className="bg-rose-600 text-white py-3 rounded-lg text-center font-bold shadow-md active:scale-95 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Appointment
                </Link>
                <Link 
                  to="/admin/login" 
                  className="text-sm text-gray-400 pt-4 border-t mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Access
                </Link>
             </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-rose-900 text-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-1">RuChiRaa</h3>
            <p className="text-rose-300 text-2xl font-medium italic mt-2">By Sonali Maharana</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/book-appointment/srv-fold-01" className="hover:text-white">Book Now</Link></li>
              <li><Link to="/admin/login" className="hover:text-white">Ruchiraa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <div className="text-xl space-y-1">
              <p>Jharagogua, Deogarh, Odisha, India</p>
              <p>ruchiraaofficial@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 border-t border-rose-800 pt-8 text-sm text-rose-300">
          © {new Date().getFullYear()} RuChiRaa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};