import { User, SareeAppointment, SareeService } from '../types';
import { supabase, supabaseUrl } from './supabaseClient';
import { DEFAULT_SAREE_SERVICES } from '../constants';

// Helper to check if Supabase is configured
export const isBackendLive = () => {
    // Check if variables exist and are not the default placeholders
    // We use the exported supabaseUrl which includes the fallback logic
    return supabaseUrl && !supabaseUrl.includes('your-project-id') && !supabaseUrl.includes('placeholder');
};

export const api = {
  // --- STORAGE ---
  uploadSareeImage: async (file: File): Promise<string | null> => {
    if (!isBackendLive()) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('saree-images')
        .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data } = supabase.storage.from('saree-images').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error("Upload exception:", error);
        return null;
    }
  },

  uploadHeroBanner: async (file: File): Promise<string | null> => {
    if (!isBackendLive()) return null;
    try {
        // We overwrite 'hero-banner' so the frontend always looks for this specific file.
        // The upsert: true allows overwriting.
        const { error: uploadError } = await supabase.storage
            .from('hero-banners')
            .upload('hero-banner', file, { upsert: true });

        if (uploadError) {
            console.error('Error uploading banner:', uploadError);
            return null;
        }

        const { data } = supabase.storage.from('hero-banners').getPublicUrl('hero-banner');
        // We append a timestamp to the return value to help the UI clear cache, 
        // though the getHeroBannerUrl function below is the main accessor.
        return `${data.publicUrl}?t=${Date.now()}`;
    } catch (e) {
        console.error(e);
        return null;
    }
  },

  getHeroBannerUrl: (): string | null => {
      if (!isBackendLive()) return null;
      const { data } = supabase.storage.from('hero-banners').getPublicUrl('hero-banner');
      return data.publicUrl;
  },

  // --- Backup/Restore ---
  downloadBackup: async () => {
    const services = await api.getSareeServices();
    const appointments = await api.getSareeAppointments();
    
    const data = {
      sareeServices: services,
      sareeAppointments: appointments,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruchiraa_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  // --- SERVICE MANAGEMENT ---
  getSareeServices: async (): Promise<SareeService[]> => {
    if (!isBackendLive()) {
        console.warn("⚠️ Supabase not connected. Using fallback data.");
        return DEFAULT_SAREE_SERVICES;
    }

    const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error("Supabase Error (Services):", error.message);
        return DEFAULT_SAREE_SERVICES;
    }
    
    // If table exists but is empty, return empty array to UI
    return (data as SareeService[]) || [];
  },

  addSareeService: async (service: SareeService): Promise<SareeService> => {
    if (!isBackendLive()) throw new Error("Database not connected");

    const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();
    
    if (error) {
        console.error("Error creating service:", error);
        throw error;
    }
    return data;
  },

  updateSareeService: async (data: SareeService): Promise<void> => {
    if (!isBackendLive()) return;

    const { error } = await supabase
        .from('services')
        .update(data)
        .eq('id', data.id);
    
    if (error) console.error("Error updating service:", error);
  },

  deleteSareeService: async (id: string): Promise<void> => {
    if (!isBackendLive()) return;

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

    if (error) console.error("Error deleting service:", error);
  },

  // --- APPOINTMENTS (The Core "Order" System) ---
  getSareeAppointments: async (): Promise<SareeAppointment[]> => {
    if (!isBackendLive()) return [];

    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error("Supabase Error (Appointments):", error.message);
        return [];
    }
    return (data as SareeAppointment[]) || [];
  },

  createSareeAppointment: async (data: Omit<SareeAppointment, 'id' | 'status' | 'created_at'>): Promise<SareeAppointment | null> => {
    if (!isBackendLive()) {
        console.error("Database Connection Missing");
        return null;
    }

    // Capacity Check Removed: We allow unlimited bookings per slot.

    // Create Appointment Object
    const newAppt = {
      ...data,
      id: `sa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Booked',
      created_at: new Date().toISOString()
    };

    // First attempt: Try to insert the full object (including image if it exists)
    const { data: inserted, error: insertError } = await supabase
        .from('appointments')
        .insert([newAppt])
        .select()
        .single();
    
    if (insertError) {
        console.warn("Initial booking failed. This might be due to a schema mismatch (e.g., missing saree_image column). Retrying with minimal data...", insertError);
        
        // Fallback Strategy: If the user hasn't updated their DB schema to include 'saree_image' or other new fields,
        // we try to insert a minimal record so the booking still succeeds.
        const minimalAppt = {
            id: newAppt.id,
            service_id: newAppt.service_id,
            customer_name: newAppt.customer_name,
            phone: newAppt.phone,
            appointment_date: newAppt.appointment_date,
            appointment_time: newAppt.appointment_time,
            status: newAppt.status,
            created_at: newAppt.created_at,
            notes: newAppt.notes || ''
        };

        const { data: retryData, error: retryError } = await supabase
            .from('appointments')
            .insert([minimalAppt])
            .select()
            .single();

        if (retryError) {
             console.error("Retry booking failed:", retryError);
             return null;
        }
        
        return retryData as SareeAppointment;
    }

    return inserted as SareeAppointment;
  },

  updateSareeAppointment: async (id: string, updates: Partial<SareeAppointment>): Promise<void> => {
    if (!isBackendLive()) return;

    const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

    if (error) console.error("Error updating appointment status:", error);
  },

  // --- AUTH (Session Management) ---
  // We keep the login session local (per device), but the Data is Global (Supabase).
  login: async (email: string): Promise<User | null> => {
    if (email === 'ruchiraaofficial@gmail.com' || email === 'admin@ruchiraa.com') {
      const user: User = { id: 'u1', email, role: 'admin', name: 'Admin User' };
      localStorage.setItem('ruchiraa_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: async () => {
    localStorage.removeItem('ruchiraa_user');
  },

  getUser: async (): Promise<User | null> => {
    const data = localStorage.getItem('ruchiraa_user');
    return data ? JSON.parse(data) : null;
  },

  // --- Legacy Stubs (Unused) ---
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