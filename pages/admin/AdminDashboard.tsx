import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api, isBackendLive } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SareeService } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    logout, 
    sareeServices, addSareeService, updateSareeService, deleteSareeService,
    sareeAppointments, updateSareeAppointment, deleteSareeAppointment
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'appointments' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for adding/editing service
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<SareeService | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerUploadStatus, setBannerUploadStatus] = useState('');
  
  // State for deletion loading
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Initial State
  const initialServiceForm: SareeService = {
      id: '',
      name: '',
      image: '',
      description: '',
      price_range: '',
      status: 'Active'
  };
  const [serviceForm, setServiceForm] = useState<SareeService>(initialServiceForm);

  // --- Handlers ---

  const handleEditClick = (service: SareeService) => {
      setCurrentService(service);
      setServiceForm(service);
      setIsEditing(true);
      setActiveTab('services'); // Ensure on correct tab
  };

  const handleAddClick = () => {
      setCurrentService(null);
      setServiceForm({...initialServiceForm, id: `srv-${Date.now()}`});
      setIsEditing(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentService) {
        await updateSareeService(serviceForm);
    } else {
        await addSareeService(serviceForm);
    }
    setIsEditing(false);
    setServiceForm(initialServiceForm);
  };

  const handleDeleteClick = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this service?")) {
          await deleteSareeService(id);
      }
  };

  const handleDeleteAppointment = async (id: string) => {
      if(window.confirm("Are you sure you want to permanently delete this appointment?")) {
          setDeletingId(id);
          await deleteSareeAppointment(id);
          setDeletingId(null);
      }
  };

  const handleMobileNav = (tab: typeof activeTab) => {
      setActiveTab(tab);
      setIsEditing(false);
      setIsMobileMenuOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsUploading(true);
        const file = e.target.files[0];
        const url = await api.uploadSareeImage(file);
        if (url) {
            setServiceForm(prev => ({ ...prev, image: url }));
        } else {
            alert("Failed to upload image. Please ensure you are connected to the database.");
        }
        setIsUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setBannerUploadStatus('Uploading...');
          const url = await api.uploadHeroBanner(e.target.files[0]);
          if (url) {
              setBannerUploadStatus('✅ Banner Updated Successfully!');
              // Clear message after 3 seconds
              setTimeout(() => setBannerUploadStatus(''), 3000);
          } else {
              setBannerUploadStatus('❌ Failed to upload. Check connection.');
          }
      }
  };

  // --- Stats ---
  const stats = [
    { name: 'Active Services', value: sareeServices.filter(s => s.status === 'Active').length },
    { name: 'Total Bookings', value: sareeAppointments.length },
    { name: 'Completed', value: sareeAppointments.filter(a => a.status === 'Completed').length },
    { name: 'Pending', value: sareeAppointments.filter(a => a.status === 'Booked').length },
  ];

  const chartData = [
    { name: 'Booked', count: sareeAppointments.filter(a => a.status === 'Booked').length },
    { name: 'Received', count: sareeAppointments.filter(a => a.status === 'Received').length },
    { name: 'In Progress', count: sareeAppointments.filter(a => a.status === 'In Progress').length },
    { name: 'Completed', count: sareeAppointments.filter(a => a.status === 'Completed').length },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className={`w-full py-2 px-4 text-center text-sm font-bold text-white ${isBackendLive() ? 'bg-green-600' : 'bg-orange-500'}`}>
        {isBackendLive() ? "Live Mode" : "Demo Mode: Local Storage"}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <span className="font-serif font-bold text-xl text-rose-500">RuChiRaa Admin</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 border border-gray-700 rounded hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 text-white border-b border-gray-700 animate-in slide-in-from-top-5">
            <button onClick={() => handleMobileNav('dashboard')} className={`block w-full text-left px-6 py-3 border-b border-gray-700 ${activeTab === 'dashboard' ? 'bg-rose-900' : ''}`}>Dashboard</button>
            <button onClick={() => handleMobileNav('services')} className={`block w-full text-left px-6 py-3 border-b border-gray-700 ${activeTab === 'services' ? 'bg-rose-900' : ''}`}>Services</button>
            <button onClick={() => handleMobileNav('appointments')} className={`block w-full text-left px-6 py-3 border-b border-gray-700 ${activeTab === 'appointments' ? 'bg-rose-900' : ''}`}>Appointments</button>
            <button onClick={() => handleMobileNav('settings')} className={`block w-full text-left px-6 py-3 border-b border-gray-700 ${activeTab === 'settings' ? 'bg-rose-900' : ''}`}>Site Settings</button>
            <button onClick={logout} className="block w-full text-left px-6 py-3 text-red-300">Logout</button>
          </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
            <div className="p-6 text-2xl font-serif font-bold text-rose-500">RuChiRaa Admin</div>
            <nav className="mt-6 px-4 space-y-2">
                <button onClick={() => {setActiveTab('dashboard'); setIsEditing(false);}} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'dashboard' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Dashboard</button>
                <button onClick={() => {setActiveTab('services'); setIsEditing(false);}} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'services' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Service Management</button>
                <button onClick={() => {setActiveTab('appointments'); setIsEditing(false);}} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'appointments' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Appointments</button>
                <button onClick={() => {setActiveTab('settings'); setIsEditing(false);}} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'settings' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Site Settings</button>
                <button onClick={() => api.downloadBackup()} className="block w-full text-left px-4 py-3 rounded text-blue-400 hover:bg-gray-800 mt-8">Backup Data</button>
                <button onClick={logout} className="block w-full text-left px-4 py-3 rounded text-red-400 hover:bg-gray-800 mt-2">Logout</button>
            </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {stats.map(s => (
                            <div key={s.name} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                                <p className="text-gray-500 text-sm">{s.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{s.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow h-80">
                         <h3 className="font-bold mb-4">Appointment Status</h3>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#e11d48" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'services' && !isEditing && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Services</h2>
                        <button onClick={handleAddClick} className="bg-green-600 text-white px-3 py-2 text-sm md:text-base md:px-4 rounded shadow hover:bg-green-700">
                            + Add Service
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sareeServices.map(service => (
                            <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                    <img 
                                        src={service.image} 
                                        alt={service.name} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerText = service.name;
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg">{service.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{service.status}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{service.description}</p>
                                    <p className="text-rose-600 font-bold mt-2">{service.price_range}</p>
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={() => handleEditClick(service)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDeleteClick(service.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded text-sm font-medium">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'services' && isEditing && (
                 <div className="max-w-2xl bg-white rounded-lg shadow p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{currentService ? 'Edit Service' : 'Add New Service'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                    <form onSubmit={handleServiceSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input type="text" className="w-full border p-2 rounded" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
                            
                            {/* URL Input & Upload Button Wrapper */}
                            <div className="flex gap-2 mb-3">
                                <div className="flex-grow">
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 p-2 rounded shadow-sm focus:ring-rose-500 focus:border-rose-500" 
                                        placeholder="Paste URL or upload..."
                                        value={serviceForm.image} 
                                        onChange={e => setServiceForm({...serviceForm, image: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className={`flex items-center px-4 py-2 bg-rose-600 text-white rounded shadow-sm cursor-pointer hover:bg-rose-700 transition ${isUploading ? 'opacity-75 cursor-wait' : ''}`}>
                                        {isUploading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        )}
                                        <span className={isUploading ? "ml-2" : ""}>{isUploading ? "Uploading" : "Upload"}</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleImageUpload} 
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Image Preview Area */}
                            <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex flex-col items-center justify-center relative">
                                {serviceForm.image ? (
                                    <>
                                        <img 
                                            src={serviceForm.image} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                // e.currentTarget.nextSibling.style.display = 'flex'; // Show placeholder if error
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 hover:opacity-100 transition-opacity">
                                            Current Image
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 mt-2">
                                            <span>No image selected</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea rows={4} className="w-full border p-2 rounded" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                                <input type="text" className="w-full border p-2 rounded" value={serviceForm.price_range} onChange={e => setServiceForm({...serviceForm, price_range: e.target.value})} required placeholder="e.g. ₹100 - ₹200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select className="w-full border p-2 rounded" value={serviceForm.status} onChange={e => setServiceForm({...serviceForm, status: e.target.value as any})}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 font-bold">
                                {currentService ? 'Update Service' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
                    
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">Homepage Hero Banner</h3>
                        <p className="text-sm text-gray-500 mb-4">Upload a new image to replace the main banner on the homepage. Recommended size: 2000x800px.</p>
                        
                        <div className="flex items-center gap-4">
                            <label className="flex items-center px-4 py-2 bg-rose-600 text-white rounded cursor-pointer hover:bg-rose-700 transition">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Upload Banner
                                <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                            </label>
                            {bannerUploadStatus && (
                                <span className={`text-sm font-medium ${bannerUploadStatus.includes('Success') ? 'text-green-600' : bannerUploadStatus.includes('Fail') ? 'text-red-600' : 'text-gray-600'}`}>
                                    {bannerUploadStatus}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                        <p><strong>Note:</strong> Changes to the hero banner may take a few moments to reflect on the main site due to caching.</p>
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold">Booking Management</h2>
                        <span className="text-sm text-gray-500">{sareeAppointments.length} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4">Date / Time</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Saree</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Notes</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sareeAppointments.map(appt => {
                                    const service = sareeServices.find(s => s.id === appt.service_id);
                                    return (
                                    <tr key={appt.id}>
                                        <td className="p-4">
                                            <div className="font-bold text-rose-700">{appt.appointment_date}</div>
                                            <div className="text-sm">{appt.appointment_time}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-sm bg-gray-100 px-2 py-1 rounded">
                                                {service ? service.name : 'Unknown Service'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{appt.customer_name}</div>
                                            <div className="text-xs text-gray-500">{appt.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            {appt.saree_image ? (
                                                <div className="relative group w-12 h-12">
                                                    <img 
                                                        src={appt.saree_image} 
                                                        alt="Saree" 
                                                        className="w-full h-full object-cover rounded border cursor-pointer"
                                                        onClick={() => {
                                                            const win = window.open();
                                                            win?.document.write('<img src="' + appt.saree_image + '" style="max-width:100%"/>');
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No Photo</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <select 
                                                className={`text-xs border rounded p-1.5 font-semibold ${
                                                    appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                    appt.status === 'Booked' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                                value={appt.status}
                                                onChange={(e) => updateSareeAppointment(appt.id, { status: e.target.value as any })}
                                            >
                                                <option value="Booked">Booked</option>
                                                <option value="Received">Received</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-gray-600 italic mb-1">C: {appt.notes || "-"}</div>
                                            <input 
                                                type="text" 
                                                placeholder="Admin notes..." 
                                                className="w-full text-xs border rounded p-1"
                                                value={appt.admin_notes || ''}
                                                onChange={(e) => updateSareeAppointment(appt.id, { admin_notes: e.target.value })}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleDeleteAppointment(appt.id)}
                                                disabled={deletingId === appt.id}
                                                className={`p-2 rounded transition ${deletingId === appt.id ? 'bg-gray-100 text-gray-400 cursor-wait' : 'text-red-500 hover:text-red-700 hover:bg-red-50'}`}
                                                title="Delete Appointment"
                                            >
                                                {deletingId === appt.id ? (
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                )})}
                                {sareeAppointments.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">No bookings found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};