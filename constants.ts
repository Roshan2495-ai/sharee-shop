import { Product, Service } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Banarasi Silk Royal Red',
    price: 12000,
    category: 'Silk',
    image: 'https://picsum.photos/400/600?random=1',
    description: 'Authentic Banarasi silk saree with intricate gold zari work, perfect for weddings.',
    isFeatured: true,
  },
  {
    id: 'p2',
    name: 'Kanjivaram Gold Leaf',
    price: 15500,
    category: 'Silk',
    image: 'https://picsum.photos/400/600?random=2',
    description: 'Traditional Kanjivaram saree featuring heavy gold border and rich texture.',
    isFeatured: true,
  },
  {
    id: 'p3',
    name: 'Chiffon Floral Breeze',
    price: 3500,
    category: 'Casual',
    image: 'https://picsum.photos/400/600?random=3',
    description: 'Lightweight chiffon saree with elegant floral prints for day events.',
  },
  {
    id: 'p4',
    name: 'Georgette Evening Blue',
    price: 4800,
    category: 'Party Wear',
    image: 'https://picsum.photos/400/600?random=4',
    description: 'Deep blue Georgette saree with stone embellishments.',
  },
  {
    id: 'p5',
    name: 'Cotton Handloom Green',
    price: 2200,
    category: 'Daily Wear',
    image: 'https://picsum.photos/400/600?random=5',
    description: 'Breathable handloom cotton saree, ideal for office wear.',
  },
  {
    id: 'p6',
    name: 'Mysore Silk Purple',
    price: 8900,
    category: 'Silk',
    image: 'https://picsum.photos/400/600?random=6',
    description: 'Soft Mysore silk with a smooth finish and minimalist border.',
    isFeatured: true,
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Bridal Makeup Deluxe',
    price: 15000,
    duration: '180 min',
    description: 'Complete bridal makeover including hair styling, draping, and HD makeup.',
    image: 'https://picsum.photos/400/300?random=10',
  },
  {
    id: 's2',
    name: 'Gold Facial Therapy',
    price: 2500,
    duration: '60 min',
    description: 'Rejuvenating gold facial for glowing skin.',
    image: 'https://picsum.photos/400/300?random=11',
  },
  {
    id: 's3',
    name: 'Hair Spa & Cut',
    price: 1800,
    duration: '45 min',
    description: 'Relaxing hair spa treatment followed by a professional haircut.',
    image: 'https://picsum.photos/400/300?random=12',
  },
  {
    id: 's4',
    name: 'Full Body Polishing',
    price: 4000,
    duration: '90 min',
    description: 'Exfoliating and moisturizing treatment for soft, radiant skin.',
    image: 'https://picsum.photos/400/300?random=13',
  }
];

export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];