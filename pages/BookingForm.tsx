import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../constants';
import { useNavigate } from 'react-router-dom';

export const BookingForm: React.FC = () => {
  const { bookSareeAppointment, sareeService } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isSuccess = await bookSareeAppointment({
        service_id: sareeService.id,
        ...formData
    });

    if (isSuccess) {
        setSuccess(true);
        window.scrollTo(0,0);
    } else {
        setError('The selected time slot is already booked. Please choose another.');
    }
  };

  if (success) {
    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                    We will see you on <strong>{formData.appointment_date}</strong> at <strong>{formData.appointment_time}</strong>.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-500 mb-8">
                    Please remember to bring your saree with you to the appointment.
                </div>
                <button onClick={() => navigate('/')} className="text-rose-600 font-bold hover:underline">Return Home</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Book Your Appointment</h1>
            <p className="text-gray-600 mt-2">For {sareeService.name}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-rose-600 p-4 text-white text-sm font-medium text-center">
                Bring Your Own Saree Service
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input required type="text" className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500"
                            value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input required type="tel" className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500"
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500"
                            value={formData.appointment_date} onChange={e => setFormData({...formData, appointment_date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                        <select required className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500"
                            value={formData.appointment_time} onChange={e => setFormData({...formData, appointment_time: e.target.value})}>
                            <option value="">-- Select Time --</option>
                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea rows={3} className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Fabric type, special instructions..."
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition shadow-lg">
                    Confirm Appointment
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};