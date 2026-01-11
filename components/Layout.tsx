import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-rose-600 font-bold' : 'text-gray-600 hover:text-rose-600';

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-serif font-bold text-rose-700">RuChiRa</span>
              <span className="hidden sm:inline-block text-sm uppercase tracking-widest text-gray-500 mt-2">Services</span>
            </Link>
            
            <div className="flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Our Service</Link>
              <Link to="/book-appointment" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition font-medium">Book Appointment</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-rose-700 font-semibold border border-rose-200 px-3 py-1 rounded">Admin</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-rose-900 text-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">RuChiRa</h3>
            <p className="text-rose-200">
              Expert saree folding and pleating services. Bring your saree, we do the rest.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/book-appointment" className="hover:text-white">Book Now</Link></li>
              <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
            <p>123 Fashion City, NY</p>
            <p>hello@ruchira.com</p>
          </div>
        </div>
        <div className="text-center mt-12 border-t border-rose-800 pt-8 text-sm text-rose-300">
          © {new Date().getFullYear()} RuChiRa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};