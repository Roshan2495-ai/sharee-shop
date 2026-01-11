import { Product, Service, Order, Appointment, User, PreBuiltOrder, SareeAppointment, SareeService } from '../types';
import { DEFAULT_SAREE_SERVICE, MOCK_PRODUCTS } from '../constants';

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
      sareeService: load('ruchira_service', DEFAULT_SAREE_SERVICE),
      sareeAppointments: load('ruchira_appointments_v2', []),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruchira_service_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  restoreBackup: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.sareeService) save('ruchira_service', data.sareeService);
                if (data.sareeAppointments) save('ruchira_appointments_v2', data.sareeAppointments);
                resolve(true);
            } catch (err) {
                console.error("Backup restore failed", err);
                resolve(false);
            }
        };
        reader.readAsText(file);
    });
  },

  // --- SERVICE MANAGEMENT (NEW) ---
  getSareeService: async (): Promise<SareeService> => {
    if (isBackendLive()) return http<SareeService>('/service-details');
    return load<SareeService>('ruchira_service', DEFAULT_SAREE_SERVICE);
  },

  updateSareeService: async (data: SareeService): Promise<void> => {
    if (isBackendLive()) {
      await http('/service-details', { method: 'PUT', body: JSON.stringify(data) });
      return;
    }
    save('ruchira_service', data);
  },

  // --- APPOINTMENTS (NEW) ---
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
    
    // Double Booking Check
    const isDoubleBooked = appointments.some(appt => 
      appt.appointment_date === data.appointment_date && 
      appt.appointment_time === data.appointment_time &&
      appt.status !== 'Booked' // Check active bookings
    );

    if (isDoubleBooked) {
      console.warn("Booking Failed: Slot taken.");
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

  // --- Legacy Stubs (To keep TS happy if legacy code runs) ---
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
};