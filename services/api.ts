import { Product, Service, Order, Appointment, User, PreBuiltOrder, SareeAppointment, SareeService } from '../types';
import { DEFAULT_SAREE_SERVICES, MOCK_PRODUCTS } from '../constants';

const API_BASE_URL = ""; 

export const isBackendLive = () => !!API_BASE_URL;

const load = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const http = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
    });
    if (!response.ok) throw new Error('API Request Failed');
    return response.json();
};

export const api = {
  // --- Backup/Restore ---
  downloadBackup: () => {
    const data = {
      sareeServices: load('ruchira_services_list', DEFAULT_SAREE_SERVICES),
      sareeAppointments: load('ruchira_appointments_v2', []),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruchira_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  // --- SERVICE MANAGEMENT (CRUD) ---
  getSareeServices: async (): Promise<SareeService[]> => {
    if (isBackendLive()) return http<SareeService[]>('/services');
    return load<SareeService[]>('ruchira_services_list', DEFAULT_SAREE_SERVICES);
  },

  addSareeService: async (service: SareeService): Promise<SareeService> => {
    if (isBackendLive()) return http<SareeService>('/services', { method: 'POST', body: JSON.stringify(service) });
    const services = load<SareeService[]>('ruchira_services_list', DEFAULT_SAREE_SERVICES);
    const newServices = [...services, service];
    save('ruchira_services_list', newServices);
    return service;
  },

  updateSareeService: async (data: SareeService): Promise<void> => {
    if (isBackendLive()) {
      await http(`/services/${data.id}`, { method: 'PUT', body: JSON.stringify(data) });
      return;
    }
    const services = load<SareeService[]>('ruchira_services_list', DEFAULT_SAREE_SERVICES);
    const updated = services.map(s => s.id === data.id ? data : s);
    save('ruchira_services_list', updated);
  },

  deleteSareeService: async (id: string): Promise<void> => {
    if (isBackendLive()) {
        await http(`/services/${id}`, { method: 'DELETE' });
        return;
    }
    const services = load<SareeService[]>('ruchira_services_list', DEFAULT_SAREE_SERVICES);
    const filtered = services.filter(s => s.id !== id);
    save('ruchira_services_list', filtered);
  },

  // --- APPOINTMENTS ---
  getSareeAppointments: async (): Promise<SareeAppointment[]> => {
    if (isBackendLive()) return http<SareeAppointment[]>('/appointments');
    return load<SareeAppointment[]>('ruchira_appointments_v2', []);
  },

  createSareeAppointment: async (data: Omit<SareeAppointment, 'id' | 'status' | 'created_at'>): Promise<SareeAppointment | null> => {
    if (isBackendLive()) {
      return http<SareeAppointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }

    const appointments = load<SareeAppointment[]>('ruchira_appointments_v2', []);
    
    // Double Booking Check: Same Service, Same Date, Same Time
    const isDoubleBooked = appointments.some(appt => 
      appt.service_id === data.service_id &&
      appt.appointment_date === data.appointment_date && 
      appt.appointment_time === data.appointment_time &&
      appt.status !== 'Booked' // Check against active bookings
    );

    if (isDoubleBooked) {
      console.warn("Booking Failed: Slot taken for this service.");
      return null;
    }

    const newAppt: SareeAppointment = {
      ...data,
      id: `sa-${Date.now()}`,
      status: 'Booked',
      created_at: new Date().toISOString()
    };
    
    save('ruchira_appointments_v2', [newAppt, ...appointments]);
    return newAppt;
  },

  updateSareeAppointment: async (id: string, updates: Partial<SareeAppointment>): Promise<void> => {
    if (isBackendLive()) {
      await http(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
      return;
    }

    const appointments = load<SareeAppointment[]>('ruchira_appointments_v2', []);
    const updatedList = appointments.map(a => a.id === id ? { ...a, ...updates } : a);
    save('ruchira_appointments_v2', updatedList);
  },

  // --- Auth ---
  login: async (email: string): Promise<User | null> => {
    if (email === 'admin@ruchira.com') {
      const user: User = { id: 'u1', email, role: 'admin', name: 'Admin User' };
      localStorage.setItem('ruchira_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: async () => {
    localStorage.removeItem('ruchira_user');
  },

  getUser: async (): Promise<User | null> => {
    return load<User | null>('ruchira_user', null);
  },

  // --- Legacy Stubs ---
  getProducts: async () => [],
  getServices: async () => [],
  getOrders: async () => [],
  createOrder: async (o: any) => o,
  updateOrderStatus: async () => {},
  getAppointments: async () => [],
  createAppointment: async () => null,
  updateAppointmentStatus: async () => {},
  getPreBuiltOrders: async () => [],
  createPreBuiltOrder: async (o: any) => o,
  updatePreBuiltOrder: async () => {},
  restoreBackup: async () => true,
};