import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { isBackendLive, api } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Product, Service } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    logout, orders, appointments, updateOrderStatus, updateAppointmentStatus,
    products, services, addProduct, deleteProduct 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'appointments'>('dashboard');
  const isLive = isBackendLive();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { name: 'Total Orders', value: orders.length },
    { name: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}` },
    { name: 'Appointments', value: appointments.length },
    { name: 'Products', value: products.length },
  ];

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const success = await api.restoreBackup(e.target.files[0]);
        if (success) {
            alert("Data restored successfully! The page will refresh.");
            window.location.reload();
        } else {
            alert("Failed to restore data. Invalid file.");
        }
    }
  };

  // Chart Data Preparation
  const orderStatusData = [
    { name: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { name: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
    { name: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
  ];

  const appointmentStatusData = [
    { name: 'Pending', count: appointments.filter(a => a.status === 'Pending').length },
    { name: 'Confirmed', count: appointments.filter(a => a.status === 'Confirmed').length },
    { name: 'Cancelled', count: appointments.filter(a => a.status === 'Cancelled').length },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Backend Status Banner */}
      <div className={`w-full py-2 px-4 text-center text-sm font-bold text-white ${isLive ? 'bg-green-600' : 'bg-orange-500'}`}>
        {isLive 
          ? "🟢 Live Mode: Connected to Backend Server" 
          : "⚠️ Demo Mode: Data is saved locally in your browser. Use 'Backup Data' to save your changes."}
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
            <div className="p-6 text-2xl font-serif font-bold text-rose-500">Admin</div>
            <nav className="mt-6 px-4 space-y-2">
            {['dashboard', 'products', 'orders', 'appointments'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`block w-full text-left px-4 py-2 rounded capitalize ${
                    activeTab === tab ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                }`}
                >
                {tab}
                </button>
            ))}
            
            <div className="border-t border-gray-800 mt-8 pt-4">
                <p className="px-4 text-xs text-gray-500 uppercase mb-2">Data Management</p>
                <button 
                    onClick={() => api.downloadBackup()}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-800 rounded"
                >
                    ⬇ Backup Data
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="block w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-800 rounded"
                >
                    ⬆ Restore Data
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleRestore} 
                    className="hidden" 
                    accept=".json"
                />
            </div>

            <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 mt-4 text-red-400 hover:bg-gray-800 rounded"
            >
                Logout
            </button>
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
            <header className="flex justify-between items-center mb-8 md:hidden">
                <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
                <button onClick={logout} className="text-sm text-red-600">Logout</button>
            </header>

            {activeTab === 'dashboard' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Orders Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderStatusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#e11d48" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Appointments Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appointmentStatusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                </div>
            </div>
            )}

            {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Product Management</h2>
                <button 
                    onClick={() => addProduct({
                        id: `p-${Date.now()}`,
                        name: 'New Saree',
                        price: 5000,
                        category: 'Silk',
                        image: 'https://picsum.photos/400/600',
                        description: 'Description here...'
                    })}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                    + Add Dummy Product
                </button>
                </div>
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.map(p => (
                    <tr key={p.id}>
                        <td className="p-4">{p.name}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4">₹{p.price}</td>
                        <td className="p-4">
                        <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}

            {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {orders.map(order => (
                    <tr key={order.id}>
                        <td className="p-4 text-sm font-mono text-gray-500">{order.id}</td>
                        <td className="p-4">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                        </td>
                        <td className="p-4 font-bold">₹{order.total.toLocaleString()}</td>
                        <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {order.status}
                        </span>
                        </td>
                        <td className="p-4">
                        <select 
                            className="text-sm border rounded p-1"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirm</option>
                            <option value="Completed">Complete</option>
                        </select>
                        </td>
                    </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders yet.</td></tr>
                    )}
                </tbody>
                </table>
                </div>
            </div>
            )}

            {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Appointments</h2>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                    <th className="p-4">Date/Time</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {appointments.map(apt => (
                    <tr key={apt.id}>
                        <td className="p-4">
                        <div className="font-medium">{apt.date}</div>
                        <div className="text-xs text-gray-500">{apt.timeSlot}</div>
                        </td>
                        <td className="p-4">
                        <div className="font-medium">{apt.customerName}</div>
                        <div className="text-xs text-gray-500">{apt.customerPhone}</div>
                        </td>
                        <td className="p-4">{apt.serviceName}</td>
                        <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                            apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {apt.status}
                        </span>
                        </td>
                        <td className="p-4">
                        <select 
                            className="text-sm border rounded p-1"
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirm</option>
                            <option value="Completed">Complete</option>
                            <option value="Cancelled">Cancel</option>
                        </select>
                        </td>
                    </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No appointments yet.</td></tr>
                    )}
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