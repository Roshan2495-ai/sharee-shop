import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Service, CartItem, Order, Appointment, User } from '../types';
import { api } from '../services/api';

interface AppContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  products: Product[];
  services: Service[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => Promise<void>;
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Cart is usually client-side only, so we keep direct localStorage here for speed
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const initData = async () => {
      const [fetchedProducts, fetchedServices, fetchedOrders, fetchedAppts, fetchedUser] = await Promise.all([
        api.getProducts(),
        api.getServices(),
        api.getOrders(),
        api.getAppointments(),
        api.getUser()
      ]);
      
      setProducts(fetchedProducts);
      setServices(fetchedServices);
      setOrders(fetchedOrders);
      setAppointments(fetchedAppts);
      setUser(fetchedUser);
    };

    initData();
  }, []);

  // Persist Cart separately (Client side preference)
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Actions ---

  const login = async (email: string, role: 'admin' | 'user') => {
    // For demo, we only check admin. Regular users are guests.
    if (role === 'admin') {
      const user = await api.login(email);
      if (user) setUser(user);
    } else {
       // Guest login logic (client side only)
       setUser({ id: 'u-guest', email, role: 'user', name: 'Guest' });
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder = await api.createOrder(orderData);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const bookAppointment = async (aptData: Omit<Appointment, 'id' | 'status'>) => {
    const newApt = await api.createAppointment(aptData);
    if (newApt) {
      setAppointments(prev => [newApt, ...prev]);
      return true;
    }
    return false;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await api.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addProduct = (product: Product) => {
    // For demo, we just update local state and localStorage in 'api.ts' manually
    // In real app: await api.createProduct(product);
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('luxe_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('luxe_products', JSON.stringify(updatedProducts));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        products,
        services,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        placeOrder,
        appointments,
        bookAppointment,
        updateOrderStatus,
        updateAppointmentStatus,
        addProduct,
        deleteProduct,
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