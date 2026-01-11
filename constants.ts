import { Product, Service, SareeService } from './types';

// DEFAULT SERVICE DATA
export const DEFAULT_SAREE_SERVICES: SareeService[] = [
  {
    id: 'srv-fold-01',
    name: 'Pre-Built Saree Folding',
    image: 'https://images.unsplash.com/photo-1610189012906-4783382c59f4?q=80&w=800&auto=format&fit=crop',
    description: 'Expert box folding service. We fold your saree into a compact, wrinkle-free shape perfect for storage or travel. Bring your saree, we fold it perfectly.',
    price_range: '₹150 - ₹300',
    status: 'Active'
  },
  {
    id: 'srv-pleat-02',
    name: 'Pre-Built Saree Pleating',
    image: 'https://images.unsplash.com/photo-1583391733975-d22797e88241?q=80&w=800&auto=format&fit=crop',
    description: 'Professional pre-pleating service. We create perfect, ironed pleats (patli) that make draping your saree taking only 1 minute. Ready to wear.',
    price_range: '₹500 - ₹1200',
    status: 'Active'
  }
];

export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

// Legacy Data (Kept for compatibility)
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_SERVICES: Service[] = [];