import type { Product } from '../types';

const R2 = 'https://dev-media.post-kar.com/markers';

/**
 * Centralized Products Data
 * Images served directly from Cloudflare R2 (dev-media.post-kar.com/markers/)
 * This is temporary fallback data — real data comes from the backend API.
 */
export const products: Product[] = [
  {
    id: 'akatsuki',
    name: 'Akatsuki',
    description: 'Bring the iconic Akatsuki clan to life with augmented reality. Scan this poster and watch the legendary shinobi emerge with stunning visual effects.',
    thumbnail_url: `${R2}/Akatsuki.jpeg`,
    image_url: `${R2}/Akatsuki.jpeg`,
    image_id: 'akatsuki',
    video_url: '',
    metadata: { category: 'Anime' },
    mrp: 999, sellingPrice: 799, discountPercentage: 20,
  },
  {
    id: 'cr7',
    name: 'CR7',
    description: 'Celebrate the GOAT of football in augmented reality. Watch Cristiano Ronaldo come alive with iconic goal celebrations and dynamic effects.',
    thumbnail_url: `${R2}/CR7.png`,
    image_url: `${R2}/CR7.png`,
    image_id: 'cr7',
    video_url: '',
    metadata: { category: 'Sports' },
    mrp: 999, sellingPrice: 849, discountPercentage: 15,
  },
  {
    id: 'messi',
    name: 'Messi',
    description: 'The greatest footballer of all time, now in augmented reality. Watch Leo Messi dribble and score with mesmerizing AR animations.',
    thumbnail_url: `${R2}/Messi.png`,
    image_url: `${R2}/Messi.png`,
    image_id: 'messi',
    video_url: '',
    metadata: { category: 'Sports' },
    mrp: 999, sellingPrice: 849, discountPercentage: 15,
  },
  {
    id: 'johnwick',
    name: 'John Wick',
    description: 'The Baba Yaga steps out of the screen. This AR poster brings the legendary assassin to life with cinematic effects and action sequences.',
    thumbnail_url: `${R2}/JohnWick.jpeg`,
    image_url: `${R2}/JohnWick.jpeg`,
    image_id: 'johnwick',
    video_url: '',
    metadata: { category: 'Movies' },
    mrp: 999, sellingPrice: 799, discountPercentage: 20,
  },
  {
    id: 'luffy',
    name: 'Luffy',
    description: 'Set sail with the future King of the Pirates. Scan this poster and watch Monkey D. Luffy stretch into action with Gear transformations.',
    thumbnail_url: `${R2}/Luffy.png`,
    image_url: `${R2}/Luffy.png`,
    image_id: 'luffy',
    video_url: '',
    metadata: { category: 'Anime' },
    mrp: 799, sellingPrice: 599, discountPercentage: 25,
  },
  {
    id: 'nagi',
    name: 'Nagi',
    description: "The Blue Lock prodigy comes alive. Experience Nagi's effortless genius with fluid AR animations that capture his unique playing style.",
    thumbnail_url: `${R2}/Nagi.png`,
    image_url: `${R2}/Nagi.png`,
    image_id: 'nagi',
    video_url: '',
    metadata: { category: 'Anime' },
    mrp: 799, sellingPrice: 599, discountPercentage: 25,
  },
  {
    id: 'psyc2',
    name: 'Psyc',
    description: 'A psychedelic AR journey into surreal visual experiences. Watch as abstract art morphs and evolves into mind-bending animations.',
    thumbnail_url: `${R2}/Psyc2.jpeg`,
    image_url: `${R2}/Psyc2.jpeg`,
    image_id: 'psyc2',
    video_url: '',
    metadata: { category: 'Abstract' },
    mrp: 699, sellingPrice: 499, discountPercentage: 28.6,
  },
  {
    id: 'charles',
    name: 'Charles',
    description: 'Experience the charisma of Charles in stunning augmented reality. An AR poster that radiates personality and style.',
    thumbnail_url: `${R2}/charles.jpeg`,
    image_url: `${R2}/charles.jpeg`,
    image_id: 'charles',
    video_url: '',
    metadata: { category: 'Portraits' },
    mrp: 899, sellingPrice: 699, discountPercentage: 22.2,
  },
  {
    id: 'tbsm',
    name: 'TBSM',
    description: 'An immersive AR experience that pushes boundaries. Scan and witness spectacular visual storytelling come to life on your wall.',
    thumbnail_url: `${R2}/TBSM.jpeg`,
    image_url: `${R2}/TBSM.jpeg`,
    image_id: 'tbsm',
    video_url: '',
    metadata: { category: 'Art' },
    mrp: 999, sellingPrice: 799, discountPercentage: 20,
  },
];

export const getFeaturedProducts = (): Product[] => products.slice(0, 6);
export const getAllProducts = (): Product[] => [...products];
export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);
