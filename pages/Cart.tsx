import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any elegant sarees yet.</p>
        <Link to="/shop" className="px-6 py-3 bg-rose-600 text-white rounded hover:bg-rose-700">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="p-6 flex items-center">
                  <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded border" />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="mt-1 text-rose-600 font-semibold">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-600">Qty: {item.quantity}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between mb-6">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-rose-700">₹{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};