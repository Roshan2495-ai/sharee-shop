import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PreBuiltService: React.FC = () => {
  const { submitPreBuiltOrder } = useApp();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    material: 'Silk' as const,
    pleatingType: 'Box Folding' as const,
    waistSize: '',
    sareeLength: '',
    blouseAttached: 'No' as const,
    pickupMethod: 'Pickup' as const,
    preferredDate: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitPreBuiltOrder(formData);
    if (success) {
      setSubmitted(true);
      window.scrollTo(0, 0);
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
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Request Received</h2>
        <p className="text-gray-600 mb-8">
          Thank you, {formData.customerName}. We have received your pre-pleating request. <br/>
          Our team will contact you at {formData.phone} shortly.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ ...formData, customerName: '', phone: '', notes: '' });
          }}
          className="text-rose-600 font-semibold hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-rose-50/50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-rose-900 mb-4">Pre-Built Saree Service</h1>
          <p className="text-gray-600">
            Get your sarees pre-pleated and ready to wear in seconds. Fill out the details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 border border-rose-100 space-y-8">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
            </div>
          </div>

          {/* Saree Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Saree Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saree Material</label>
                <select name="material" value={formData.material} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pleating Type</label>
                <select name="pleatingType" value={formData.pleatingType} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Box Folding">Box Folding</option>
                  <option value="Floppy Pleating">Floppy Pleating</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waist Size (cm)</label>
                <input required type="number" name="waistSize" value={formData.waistSize} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saree Length (meters)</label>
                <input required type="number" step="0.1" name="sareeLength" value={formData.sareeLength} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blouse Attached?</label>
                <div className="flex gap-4 mt-2">
                   <label className="flex items-center"><input type="radio" name="blouseAttached" value="Yes" checked={formData.blouseAttached === 'Yes'} onChange={handleChange} className="mr-2 text-rose-600" /> Yes</label>
                   <label className="flex items-center"><input type="radio" name="blouseAttached" value="No" checked={formData.blouseAttached === 'No'} onChange={handleChange} className="mr-2 text-rose-600" /> No</label>
                </div>
              </div>
            </div>
          </div>

          {/* Service Logistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Service Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Method</label>
                <select name="pickupMethod" value={formData.pickupMethod} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500">
                  <option value="Pickup">I will drop off the saree at shop</option>
                  <option value="Drop">Please pickup from my address (+₹100)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Completion Date</label>
                <input required type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" />
              </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea rows={3} name="notes" value={formData.notes} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-rose-500 focus:border-rose-500" placeholder="Specific instructions..."></textarea>
              </div>
          </div>

          <div className="pt-4">
             <button type="submit" className="w-full bg-rose-700 text-white font-bold py-4 rounded-lg hover:bg-rose-800 transition shadow-lg">
                Submit Request
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};