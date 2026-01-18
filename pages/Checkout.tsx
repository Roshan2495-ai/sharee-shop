import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const { cart, placeOrder } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      address: formData.address,
      items: cart,
      total,
    });
    setIsSuccess(true);
    setTimeout(() => {
        navigate('/');
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-green-100 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">Thank you for shopping with RuChiRaa. Your order will be delivered soon.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>
      
      <div className="bg-white shadow rounded-lg p-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              required
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              required
              type="tel" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea 
              required
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
            <div className="flex items-center">
              <input checked readOnly type="radio" className="h-4 w-4 text-rose-600 focus:ring-rose-500" />
              <label className="ml-3 block text-sm font-medium text-gray-700">
                Cash on Delivery (COD)
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-7">Pay securely when your package arrives.</p>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-rose-700">₹{total.toLocaleString()}</span>
            </div>
            <button 
              type="submit"
              className="w-full bg-rose-600 text-white py-4 rounded-md font-bold text-lg hover:bg-rose-700 shadow-lg transition"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};