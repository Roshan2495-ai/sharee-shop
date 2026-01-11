import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';

export const BookingForm: React.FC = () => {
  const { bookSareeAppointment, sareeServices } = useApp();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState(sareeServices.find(s => s.id === serviceId));

  useEffect(() => {
    // If services load async or URL param changes
    setSelectedService(sareeServices.find(s => s.id === serviceId));
  }, [sareeServices, serviceId]);
  
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

    if (!selectedService) {
        setError("Invalid service selected.");
        return;
    }

    const isSuccess = await bookSareeAppointment({
        service_id: selectedService.id,
        ...formData
    });

    if (isSuccess) {
        setSuccess(true);
        window.scrollTo(0,0);
    } else {
        setError('The selected time slot is already booked for this service. Please choose another.');
    }
  };

  if (!selectedService) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-700">Service Not Found</h2>
                  <button onClick={() => navigate('/')} className="text-rose-600 underline mt-4">Return to Services</button>
              </div>
          </div>
      );
  }

  if (success) {
    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-2">
                    Service: <strong>{selectedService.name}</strong>
                </p>
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
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-gray-500 hover:text-rose-600 transition">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Services
        </button>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Book Appointment</h1>
            <p className="text-rose-600 font-medium mt-2 text-lg">{selectedService.name}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gray-900 p-4 flex items-center justify-between px-8">
                 <span className="text-white text-sm font-medium">Service Only</span>
                 <span className="text-rose-400 text-sm font-bold">{selectedService.price_range}</span>
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
                        placeholder="Any special instructions..."
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-lg hover:bg-rose-700 transition shadow-lg">
                    Confirm Appointment
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};