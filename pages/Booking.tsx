import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../constants';

export const Booking: React.FC = () => {
  const { serviceId } = useParams();
  const { services, bookAppointment } = useApp();
  const navigate = useNavigate();
  
  const [selectedServiceId, setSelectedServiceId] = useState(serviceId || '');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (serviceId) setSelectedServiceId(serviceId);
  }, [serviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return;

    const success = bookAppointment({
      customerName: formData.name,
      customerPhone: formData.phone,
      serviceId: service.id,
      serviceName: service.name,
      date: formData.date,
      timeSlot: formData.timeSlot
    });

    if (success) {
      setSuccess(true);
      setTimeout(() => navigate('/services'), 3000);
    } else {
      setError('This time slot is already booked. Please choose another.');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-green-100 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-600">We look forward to serving you.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Book an Appointment</h1>
      
      <div className="bg-white shadow-lg rounded-xl p-8 border border-rose-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
            <select 
              required
              className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              <option value="">-- Choose a Service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.duration} (₹{s.price})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                required
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                required
                type="tel"
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select 
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500"
                value={formData.timeSlot}
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
              >
                <option value="">-- Select Time --</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-rose-600 text-white py-3 rounded-md font-bold hover:bg-rose-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};