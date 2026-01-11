export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., "60 min"
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Completed';
  date: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}