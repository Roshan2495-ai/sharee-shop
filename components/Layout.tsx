import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, user } = useApp();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-rose-600 font-bold' : 'text-gray-600 hover:text-rose-600';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-serif font-bold text-rose-700">Luxe</span>
              <span className="hidden sm:inline-block text-sm uppercase tracking-widest text-gray-500 mt-2">Saree & Parlor</span>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/shop" className={isActive('/shop')}>Saree Shop</Link>
              <Link to="/services" className={isActive('/services')}>Services</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-rose-700 font-semibold">Admin Panel</Link>
              )}
            </div>

            <div className="flex items-center gap-4">
               <Link to="/cart" className="relative p-2 text-gray-600 hover:text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <div className="md:hidden">
                {/* Mobile Menu Button - simplified */}
                <button className="text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-rose-900 text-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Luxe Saree & Parlor</h3>
            <p className="text-rose-200">
              Experience the elegance of tradition with our exquisite sarees and rejuvenate your beauty with our premium parlor services.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-white">Shop Sarees</Link></li>
              <li><Link to="/services" className="hover:text-white">Book Service</Link></li>
              <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
            <p>123 Elegance Street, Fashion City</p>
            <p>Phone: +1 234 567 8900</p>
            <p>Email: hello@luxesaree.com</p>
          </div>
        </div>
        <div className="text-center mt-12 border-t border-rose-800 pt-8 text-sm text-rose-300">
          © {new Date().getFullYear()} Luxe Saree & Parlor. All rights reserved.
        </div>
      </footer>
    </div>
  );
};