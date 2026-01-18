import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@ruchiraa.com' && password === 'admin123') {
      login(email, 'admin');
      navigate('/admin');
    } else {
      setError('Invalid credentials (Try: admin@ruchiraa.com / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-500">Secure Access</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ruchiraa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-rose-600 hover:underline">
                Return to Shop
            </button>
        </div>
      </div>
    </div>
  );
};