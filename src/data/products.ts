import type { Product } from '../types';

/**
 * Centralized Products Data
 * Contains all 17 products with their corresponding images from public/images/products/
 * This ensures consistent data between Landing Page (shows first 6) and Products Page (shows all 17)
 */
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Amber Tongue Elixir',
    description: 'A mystical AR poster that brings ancient alchemy to life. Scan to witness the transformation of amber essence into liquid gold with mesmerizing visual effects.',
    thumbnail_url: '/images/products/Amber Tongue Elixir.jpg',
    image_url: '/images/products/Amber Tongue Elixir.jpg',
    image_id: 'img-001',
    video_url: 'https://example.com/videos/amber-elixir-demo.mp4',
    metadata: {
      category: 'Mystical',
      tags: ['alchemy', 'amber', 'transformation'],
      created_at: '2024-01-15T10:00:00Z'
    }
  },
  {
    id: 'prod-002',
    name: 'Astral Nataraja Surge',
    description: 'Experience the cosmic dance of Lord Nataraja in augmented reality. This poster transforms into a swirling galaxy of divine energy and celestial movements.',
    thumbnail_url: '/images/products/Astral Nataraja Surge.jpg',
    image_url: '/images/products/Astral Nataraja Surge.jpg',
    image_id: 'img-002',
    video_url: 'https://example.com/videos/nataraja-demo.mp4',
    metadata: {
      category: 'Spiritual',
      tags: ['nataraja', 'cosmic', 'dance'],
      created_at: '2024-01-20T14:30:00Z'
    }
  },
  {
    id: 'prod-003',
    name: 'Baba Yaga Silhouette',
    description: 'Step into Slavic folklore with this haunting AR poster. Watch as Baba Yaga\'s hut comes alive with mystical creatures and enchanted forest spirits.',
    thumbnail_url: '/images/products/Baba Yaga Silhouette.jpg',
    image_url: '/images/products/Baba Yaga Silhouette.jpg',
    image_id: 'img-003',
    video_url: 'https://example.com/videos/baba-yaga-demo.mp4',
    metadata: {
      category: 'Folklore',
      tags: ['folklore', 'slavic', 'mystical'],
      created_at: '2024-02-01T09:15:00Z'
    }
  },
  {
    id: 'prod-004',
    name: 'Delhi Verse Velocity',
    description: 'Urban poetry meets AR technology. This poster showcases the vibrant street art and cultural rhythm of Delhi through dynamic visual storytelling.',
    thumbnail_url: '/images/products/Delhi Verse Velocity.webp',
    image_url: '/images/products/Delhi Verse Velocity.webp',
    image_id: 'img-004',
    video_url: 'https://example.com/videos/delhi-verse-demo.mp4',
    metadata: {
      category: 'Urban Culture',
      tags: ['delhi', 'street art', 'poetry'],
      created_at: '2024-02-05T16:45:00Z'
    }
  },
  {
    id: 'prod-005',
    name: 'Eternal Strike Zenith',
    description: 'Martial arts mastery in AR form. Watch as ancient fighting techniques come alive with energy trails and power demonstrations.',
    thumbnail_url: '/images/products/Eternal Strike Zenith.webp',
    image_url: '/images/products/Eternal Strike Zenith.webp',
    image_id: 'img-005',
    video_url: 'https://example.com/videos/eternal-strike-demo.mp4',
    metadata: {
      category: 'Martial Arts',
      tags: ['martial arts', 'energy', 'combat'],
      created_at: '2024-02-10T11:20:00Z'
    }
  },
  {
    id: 'prod-006',
    name: 'Gilded Smile Paradox',
    description: 'A surreal AR experience that explores the duality of joy and mystery. The golden smile transforms into intricate patterns and hidden meanings.',
    thumbnail_url: '/images/products/Gilded Smile Paradox.jpg',
    image_url: '/images/products/Gilded Smile Paradox.jpg',
    image_id: 'img-006',
    video_url: 'https://example.com/videos/gilded-smile-demo.mp4',
    metadata: {
      category: 'Surreal',
      tags: ['surreal', 'golden', 'paradox'],
      created_at: '2024-02-15T13:10:00Z'
    }
  },
  {
    id: 'prod-007',
    name: 'Heritage Portrait Collection',
    description: 'Traditional portraiture meets modern AR technology. These classic portraits come alive with historical context and cultural stories.',
    thumbnail_url: '/images/products/IMG-20250517-WA0034.jpg',
    image_url: '/images/products/IMG-20250517-WA0034.jpg',
    image_id: 'img-007',
    video_url: 'https://example.com/videos/heritage-portrait-demo.mp4',
    metadata: {
      category: 'Heritage',
      tags: ['portrait', 'heritage', 'traditional'],
      created_at: '2024-02-20T08:30:00Z'
    }
  },
  {
    id: 'prod-008',
    name: 'Cultural Mosaic Experience',
    description: 'A vibrant celebration of cultural diversity through AR. Multiple cultural elements blend and interact in a beautiful digital tapestry.',
    thumbnail_url: '/images/products/IMG-20250517-WA0048.jpg',
    image_url: '/images/products/IMG-20250517-WA0048.jpg',
    image_id: 'img-008',
    video_url: 'https://example.com/videos/cultural-mosaic-demo.mp4',
    metadata: {
      category: 'Cultural',
      tags: ['culture', 'diversity', 'mosaic'],
      created_at: '2024-02-25T15:45:00Z'
    }
  },
  {
    id: 'prod-009',
    name: 'Jetstream Hyperforge',
    description: 'Futuristic technology visualization in AR. Experience the power of advanced engineering with dynamic particle effects and holographic displays.',
    thumbnail_url: '/images/products/Jetstream Hyperforge.jpg',
    image_url: '/images/products/Jetstream Hyperforge.jpg',
    image_id: 'img-009',
    video_url: 'https://example.com/videos/jetstream-demo.mp4',
    metadata: {
      category: 'Futuristic',
      tags: ['technology', 'futuristic', 'engineering'],
      created_at: '2024-03-01T12:00:00Z'
    }
  },
  {
    id: 'prod-010',
    name: 'Marlboro Mirth Pack',
    description: 'A nostalgic AR journey through vintage advertising aesthetics. Classic design elements come alive with retro animations and period-appropriate effects.',
    thumbnail_url: '/images/products/Marlboro Mirth Pack.jpg',
    image_url: '/images/products/Marlboro Mirth Pack.jpg',
    image_id: 'img-010',
    video_url: 'https://example.com/videos/marlboro-demo.mp4',
    metadata: {
      category: 'Vintage',
      tags: ['vintage', 'retro', 'advertising'],
      created_at: '2024-03-05T10:15:00Z'
    }
  },
  {
    id: 'prod-011',
    name: 'Phantom Field Devourer',
    description: 'Dark fantasy meets AR technology. Witness otherworldly creatures emerge from shadowy realms with spine-chilling visual effects.',
    thumbnail_url: '/images/products/Phantom Field Devourer.jpg',
    image_url: '/images/products/Phantom Field Devourer.jpg',
    image_id: 'img-011',
    video_url: 'https://example.com/videos/phantom-field-demo.mp4',
    metadata: {
      category: 'Dark Fantasy',
      tags: ['dark fantasy', 'phantom', 'supernatural'],
      created_at: '2024-03-10T14:20:00Z'
    }
  },
  {
    id: 'prod-012',
    name: 'Prancing Heart Ignition',
    description: 'Love and passion visualized through AR. Hearts burst into flames of emotion with romantic particle effects and warm color palettes.',
    thumbnail_url: '/images/products/Prancing Heart Ignition.jpg',
    image_url: '/images/products/Prancing Heart Ignition.jpg',
    image_id: 'img-012',
    video_url: 'https://example.com/videos/prancing-heart-demo.mp4',
    metadata: {
      category: 'Romance',
      tags: ['romance', 'heart', 'passion'],
      created_at: '2024-03-15T16:30:00Z'
    }
  },
  {
    id: 'prod-013',
    name: 'Red Devil Dynasty Ember',
    description: 'Fiery AR experience with demonic aesthetics. Red flames and ember effects create an intense visual spectacle of power and mystery.',
    thumbnail_url: '/images/products/Red Devil Dynasty Ember.jpg',
    image_url: '/images/products/Red Devil Dynasty Ember.jpg',
    image_id: 'img-013',
    video_url: 'https://example.com/videos/red-devil-demo.mp4',
    metadata: {
      category: 'Intense',
      tags: ['fire', 'devil', 'intense'],
      created_at: '2024-03-20T11:45:00Z'
    }
  },
  {
    id: 'prod-014',
    name: 'Rubber Dawn Cataclysm',
    description: 'Post-apocalyptic AR visualization with industrial aesthetics. Experience the beauty in destruction through dynamic environmental effects.',
    thumbnail_url: '/images/products/Rubber Dawn Cataclysm.jpg',
    image_url: '/images/products/Rubber Dawn Cataclysm.jpg',
    image_id: 'img-014',
    video_url: 'https://example.com/videos/rubber-dawn-demo.mp4',
    metadata: {
      category: 'Post-Apocalyptic',
      tags: ['apocalyptic', 'industrial', 'destruction'],
      created_at: '2024-03-25T09:10:00Z'
    }
  },
  {
    id: 'prod-015',
    name: 'Titanium Apex Symphony',
    description: 'Metallic elegance in AR form. Watch as titanium structures morph and dance to create a symphony of geometric beauty and industrial grace.',
    thumbnail_url: '/images/products/Titanium Apex Symphony.jpg',
    image_url: '/images/products/Titanium Apex Symphony.jpg',
    image_id: 'img-015',
    video_url: 'https://example.com/videos/titanium-symphony-demo.mp4',
    metadata: {
      category: 'Industrial',
      tags: ['titanium', 'metallic', 'geometric'],
      created_at: '2024-03-30T13:25:00Z'
    }
  },
  {
    id: 'prod-016',
    name: 'Urban Chakra Sunrise',
    description: 'Spiritual awakening meets urban landscape. Chakra energy flows through city scenes creating a harmonious blend of modern life and ancient wisdom.',
    thumbnail_url: '/images/products/Urban Chakra Sunrise.jpg',
    image_url: '/images/products/Urban Chakra Sunrise.jpg',
    image_id: 'img-016',
    video_url: 'https://example.com/videos/urban-chakra-demo.mp4',
    metadata: {
      category: 'Spiritual Urban',
      tags: ['chakra', 'urban', 'spiritual'],
      created_at: '2024-04-05T07:40:00Z'
    }
  },
  {
    id: 'prod-017',
    name: 'Verdigris Void Oracle',
    description: 'Ancient wisdom meets cosmic mystery. Green copper patina effects swirl around mystical symbols revealing hidden knowledge through AR.',
    thumbnail_url: '/images/products/Verdigris Void Oracle.jpg',
    image_url: '/images/products/Verdigris Void Oracle.jpg',
    image_id: 'img-017',
    video_url: 'https://example.com/videos/verdigris-oracle-demo.mp4',
    metadata: {
      category: 'Mystical',
      tags: ['oracle', 'ancient', 'mystical'],
      created_at: '2024-04-10T15:55:00Z'
    }
  }
];

/**
 * Get featured products (first 6) for landing page
 */
export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 6);
};

/**
 * Get all products for products page
 */
export const getAllProducts = (): Product[] => {
  return [...products];
};

/**
 * Get product by ID
 */
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
