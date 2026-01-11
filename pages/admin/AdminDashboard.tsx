import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api, isBackendLive } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { 
    logout, 
    sareeService, updateSareeService,
    sareeAppointments, updateSareeAppointment
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'service' | 'appointments'>('dashboard');
  const [serviceForm, setServiceForm] = useState(sareeService);

  // Stats
  const stats = [
    { name: 'Active Service', value: sareeService.status },
    { name: 'Total Bookings', value: sareeAppointments.length },
    { name: 'Completed', value: sareeAppointments.filter(a => a.status === 'Completed').length },
    { name: 'Pending', value: sareeAppointments.filter(a => a.status === 'Booked').length },
  ];

  const handleServiceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSareeService(serviceForm);
    alert('Service details updated successfully!');
  };

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

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
            <div className="p-6 text-2xl font-serif font-bold text-rose-500">RuChiRa Admin</div>
            <nav className="mt-6 px-4 space-y-2">
                <button onClick={() => setActiveTab('dashboard')} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'dashboard' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Dashboard</button>
                <button onClick={() => setActiveTab('service')} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'service' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Service Management</button>
                <button onClick={() => setActiveTab('appointments')} className={`block w-full text-left px-4 py-3 rounded ${activeTab === 'appointments' ? 'bg-rose-600' : 'hover:bg-gray-800'}`}>Appointments</button>
                <button onClick={() => api.downloadBackup()} className="block w-full text-left px-4 py-3 rounded text-blue-400 hover:bg-gray-800 mt-8">Backup Data</button>
                <button onClick={logout} className="block w-full text-left px-4 py-3 rounded text-red-400 hover:bg-gray-800 mt-2">Logout</button>
            </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

            {activeTab === 'service' && (
                <div className="max-w-2xl bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold mb-6">Edit Service Details</h2>
                    <form onSubmit={handleServiceUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input type="text" className="w-full border p-2 rounded" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input type="text" className="w-full border p-2 rounded" value={serviceForm.image} onChange={e => setServiceForm({...serviceForm, image: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea rows={4} className="w-full border p-2 rounded" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                                <input type="text" className="w-full border p-2 rounded" value={serviceForm.price_range} onChange={e => setServiceForm({...serviceForm, price_range: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select className="w-full border p-2 rounded" value={serviceForm.status} onChange={e => setServiceForm({...serviceForm, status: e.target.value as any})}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700">Save Changes</button>
                    </form>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Booking Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4">Date / Time</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sareeAppointments.map(appt => (
                                    <tr key={appt.id}>
                                        <td className="p-4">
                                            <div className="font-bold text-rose-700">{appt.appointment_date}</div>
                                            <div className="text-sm">{appt.appointment_time}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{appt.customer_name}</div>
                                            <div className="text-xs text-gray-500">{appt.phone}</div>
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
                                            <div className="text-xs text-gray-600 italic mb-1">Customer: {appt.notes || "None"}</div>
                                            <input 
                                                type="text" 
                                                placeholder="Admin notes..." 
                                                className="w-full text-xs border rounded p-1"
                                                value={appt.admin_notes || ''}
                                                onChange={(e) => updateSareeAppointment(appt.id, { admin_notes: e.target.value })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {sareeAppointments.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No bookings found.</td></tr>}
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