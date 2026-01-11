import { Product, Service, Order, Appointment, User } from '../types';
import { MOCK_PRODUCTS, MOCK_SERVICES } from '../constants';

// =================================================================
// 🔧 BACKEND CONFIGURATION
// =================================================================
// To use a real Laravel/Node backend:
// 1. Build your API with endpoints: /products, /orders, /login, etc.
// 2. Paste the URL here (e.g., "https://my-laravel-app.com/api")
// 3. The app will automatically switch from LocalStorage to your API.
// =================================================================
const API_BASE_URL = ""; 

// Helper to check if we are using real backend
export const isBackendLive = () => !!API_BASE_URL;

// Helper to safely load from storage (Fallback for Demo Mode)
const load = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generic HTTP Helper
const http = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
    });
    if (!response.ok) throw new Error('API Request Failed');
    return response.json();
};

export const api = {
  // --- Data Management (Backup/Restore) ---
  downloadBackup: () => {
    const data = {
      products: load('luxe_products', MOCK_PRODUCTS),
      orders: load('luxe_orders', []),
      appointments: load('luxe_appointments', []),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxe_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  restoreBackup: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.products) save('luxe_products', data.products);
                if (data.orders) save('luxe_orders', data.orders);
                if (data.appointments) save('luxe_appointments', data.appointments);
                resolve(true);
            } catch (err) {
                console.error("Backup restore failed", err);
                resolve(false);
            }
        };
        reader.readAsText(file);
    });
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    if (isBackendLive()) return http<Product[]>('/products');
    return load<Product[]>('luxe_products', MOCK_PRODUCTS);
  },

  // --- Services ---
  getServices: async (): Promise<Service[]> => {
    if (isBackendLive()) return http<Service[]>('/services');
    return MOCK_SERVICES;
  },

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    if (isBackendLive()) return http<Order[]>('/orders');
    return load<Order[]>('luxe_orders', []);
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'status' | 'date'>): Promise<Order> => {
    if (isBackendLive()) {
        return http<Order>('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Local Fallback
    const orders = load<Order[]>('luxe_orders', []);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    save('luxe_orders', [newOrder, ...orders]);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    if (isBackendLive()) {
        await http(`/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        return;
    }

    // Local Fallback
    const orders = load<Order[]>('luxe_orders', []);
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    save('luxe_orders', updated);
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    if (isBackendLive()) return http<Appointment[]>('/appointments');
    return load<Appointment[]>('luxe_appointments', []);
  },

  createAppointment: async (aptData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment | null> => {
    if (isBackendLive()) {
        try {
            return await http<Appointment>('/appointments', {
                method: 'POST',
                body: JSON.stringify(aptData)
            });
        } catch (e) {
            return null; // Assume conflict/error
        }
    }

    // Local Fallback
    const appts = load<Appointment[]>('luxe_appointments', []);
    
    // Check for double booking
    const conflict = appts.find(a => 
      a.date === aptData.date && 
      a.timeSlot === aptData.timeSlot && 
      a.status !== 'Cancelled'
    );
    
    if (conflict) return null;

    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Pending',
    };
    save('luxe_appointments', [newApt, ...appts]);
    return newApt;
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']): Promise<void> => {
    if (isBackendLive()) {
        await http(`/appointments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        return;
    }

    // Local Fallback
    const appts = load<Appointment[]>('luxe_appointments', []);
    const updated = appts.map(a => a.id === id ? { ...a, status } : a);
    save('luxe_appointments', updated);
  },

  // --- Auth ---
  login: async (email: string): Promise<User | null> => {
    if (isBackendLive()) {
        try {
            return await http<User>('/login', {
                method: 'POST',
                body: JSON.stringify({ email }) 
            });
        } catch (e) {
            return null;
        }
    }

    // Local Fallback
    if (email === 'admin@luxe.com') {
      const user: User = { id: 'u1', email, role: 'admin', name: 'Admin User' };
      localStorage.setItem('luxe_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: async () => {
    // If backend uses cookies, you might call /logout endpoint here
    localStorage.removeItem('luxe_user');
  },

  getUser: async (): Promise<User | null> => {
    return load<User | null>('luxe_user', null);
  }
};