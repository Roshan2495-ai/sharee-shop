import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../constants';

export const SareeAppointment: React.FC = () => {
  const { bookSareeAppointment } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    fabric_type: 'Silk' as const,
    pleating_type: 'Box Folding' as const,
    waist_size: '',
    appointment_date: '',
    appointment_time: '',
    pickup_method: 'Drop at Shop' as const,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await bookSareeAppointment(formData);
    
    if (success) {
      setSubmitted(true);
      window.scrollTo(0, 0);
    } else {
      setError('This time slot is already booked! Please select another time.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-green-100 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Appointment Confirmed</h2>
        <p className="text-gray-600 mb-8">
          Thank you, {formData.customer_name}.<br/> 
          Your folding service appointment is set for <b>{formData.appointment_date}</b> at <b>{formData.appointment_time}</b>.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ ...formData, customer_name: '', phone: '', notes: '' });
          }}
          className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-rose-50/50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-rose-600 font-bold tracking-widest text-sm uppercase">Service Only • Bring Your Saree</span>
          <h1 className="text-4xl font-serif font-bold text-rose-900 mt-2 mb-4">Pre-Built Folding & Pleating</h1>
          <p className="text-gray-600">
            Book an appointment to have your saree professionally pleated (Box or Floppy) by our experts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 border border-rose-100 space-y-8">
          
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
            </div>
          </div>

          {/* Saree Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Service Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                <select name="fabric_type" value={formData.fabric_type} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Chiffon">Chiffon</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pleating Style</label>
                <select name="pleating_type" value={formData.pleating_type} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Box Folding">Box Folding</option>
                  <option value="Floppy Pleating">Floppy Pleating</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waist Size (Optional)</label>
                <input type="text" name="waist_size" placeholder="e.g. 32 inches" value={formData.waist_size} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup/Drop</label>
                <select name="pickup_method" value={formData.pickup_method} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Drop at Shop">I will drop saree at shop</option>
                  <option value="Pickup Request">Request pickup from my home</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointment Slot */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Appointment Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input required type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <select required name="appointment_time" value={formData.appointment_time} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500">
                    <option value="">-- Select Time --</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200">
                    ⚠️ {error}
                </div>
            )}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea rows={2} name="notes" value={formData.notes} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500" placeholder="Any specific requirements..."></textarea>
              </div>
          </div>

          <div className="pt-4">
             <button type="submit" className="w-full bg-rose-700 text-white font-bold py-4 rounded-lg hover:bg-rose-800 transition shadow-lg">
                Confirm Appointment
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};