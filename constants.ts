import { Product, Service, SareeService } from './types';

// DEFAULT SERVICE DATA
export const DEFAULT_SAREE_SERVICE: SareeService = {
  id: 'srv-01',
  name: 'Pre-Built Saree Folding & Pleating',
  image: 'https://picsum.photos/id/435/800/600',
  description: 'Professional box folding and floppy pleating service for your sarees. Bring your own saree and get it ready-to-wear in minutes. Perfect for weddings and events.',
  price_range: '₹500 - ₹1200',
  status: 'Active'
};

export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

// Legacy Data (Kept for compatibility)
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_SERVICES: Service[] = [];