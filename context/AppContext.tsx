import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SareeService, SareeAppointment, Product, CartItem, Order, Service, Appointment, PreBuiltOrder } from '../types';
import { api } from '../services/api';
import { DEFAULT_SAREE_SERVICE } from '../constants';

interface AppContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  
  // Core Service Data
  sareeService: SareeService;
  updateSareeService: (data: SareeService) => Promise<void>;
  
  // Appointment Data
  sareeAppointments: SareeAppointment[];
  bookSareeAppointment: (data: Omit<SareeAppointment, 'id' | 'status' | 'created_at'>) => Promise<boolean>;
  updateSareeAppointment: (id: string, updates: Partial<SareeAppointment>) => Promise<void>;

  // Legacy (Stubs)
  products: Product[];
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (o: any) => Promise<void>;
  services: Service[];
  orders: Order[];
  updateOrderStatus: (id: string, status: any) => Promise<void>;
  addProduct: (p: any) => void;
  deleteProduct: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sareeService, setSareeService] = useState<SareeService>(DEFAULT_SAREE_SERVICE);
  const [sareeAppointments, setSareeAppointments] = useState<SareeAppointment[]>([]);

  // Initial Data Load
  useEffect(() => {
    const initData = async () => {
      const [fetchedUser, fetchedService, fetchedAppts] = await Promise.all([
        api.getUser(),
        api.getSareeService(),
        api.getSareeAppointments()
      ]);
      setUser(fetchedUser);
      setSareeService(fetchedService);
      setSareeAppointments(fetchedAppts);
    };
    initData();
  }, []);

  const login = async (email: string, role: 'admin' | 'user') => {
    if (role === 'admin') {
      const user = await api.login(email);
      if (user) setUser(user);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  // Service Management
  const updateSareeServiceState = async (data: SareeService) => {
    await api.updateSareeService(data);
    setSareeService(data);
  };

  // Appointment Management
  const bookSareeAppointment = async (data: Omit<SareeAppointment, 'id' | 'status' | 'created_at'>) => {
    const newAppt = await api.createSareeAppointment(data);
    if (newAppt) {
      setSareeAppointments(prev => [newAppt, ...prev]);
      return true;
    }
    return false;
  };

  const updateSareeAppointment = async (id: string, updates: Partial<SareeAppointment>) => {
    await api.updateSareeAppointment(id, updates);
    setSareeAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        sareeService,
        updateSareeService: updateSareeServiceState,
        sareeAppointments,
        bookSareeAppointment,
        updateSareeAppointment,
        // Legacy Stubs
        products: [],
        cart: [],
        addToCart: () => {},
        removeFromCart: () => {},
        clearCart: () => {},
        placeOrder: async () => {},
        services: [],
        orders: [],
        updateOrderStatus: async () => {},
        addProduct: () => {},
        deleteProduct: () => {},
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};