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
    notes: '',
    saree_image: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          setError("File is too large. Please upload an image under 5MB.");
          return;
      }
      setError(''); // Clear previous errors
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, saree_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Saree Photo (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-rose-400 transition-colors">
                        <div className="space-y-1 text-center">
                            {formData.saree_image ? (
                                <div className="relative">
                                    <img src={formData.saree_image} alt="Preview" className="mx-auto h-48 object-contain rounded" />
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, saree_image: ''})}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500">
                                            <span>Upload a photo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                </>
                            )}
                        </div>
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