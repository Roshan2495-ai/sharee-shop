import { Product, Service, SareeService } from './types';

// DEFAULT SERVICE DATA
export const DEFAULT_SAREE_SERVICES: SareeService[] = [
  {
    id: 'srv-fold-01',
    name: 'Pre-Built Saree Folding',
    // Image: Stack of folded fabrics/sarees
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop',
    description: 'Expert box folding service. We fold your saree into a compact, wrinkle-free shape perfect for storage or travel. Bring your saree, we fold it perfectly.',
    price_range: '₹150 - ₹300',
    status: 'Active'
  },
  {
    id: 'srv-pleat-02',
    name: 'Pre-Built Saree Pleating',
    // Image: Draped fabric with pleats
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
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