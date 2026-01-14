
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isFeatured?: boolean;
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

// --- NEW CORE TYPES ---

export interface SareeService {
  id: string;
  name: string;
  image: string;
  description: string;
  price_range: string; // e.g. "₹50 - ₹100"
  status: 'Active' | 'Inactive';
}

export interface SareeAppointment {
  id: string;
  service_id: string; // Links to SareeService
  customer_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  admin_notes?: string;
  status: 'Booked' | 'Received' | 'In Progress' | 'Completed' | 'Delivered';
  created_at: string;
  saree_image?: string; // Base64 string of uploaded image
  // Extended fields
  fabric_type?: string;
  pleating_type?: string;
  waist_size?: string;
  pickup_method?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

// Legacy types kept to prevent build errors in untouched files
export interface Service { id: string; name: string; price: number; duration: string; description: string; image: string; }
export interface Appointment { id: string; customerName: string; customerPhone: string; serviceId: string; serviceName: string; date: string; timeSlot: string; status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'; }
export interface PreBuiltOrder { id: string; customerName: string; phone: string; material: string; pleatingType: string; waistSize: string; sareeLength: string; blouseAttached: string; pickupMethod: string; preferredDate: string; notes?: string; adminNotes?: string; status: string; createdAt: string; }