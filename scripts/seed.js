const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce'

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  brand: String,
  stock: Number,
  rating: Number,
  reviewCount: Number,
  tags: [String],
  featured: Boolean,
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const products = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones Pro',
    description: 'Experience immersive sound with our premium wireless headphones featuring industry-leading noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions.',
    price: 299.99,
    originalPrice: 399.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    category: 'Electronics',
    brand: 'SoundElite',
    stock: 45,
    rating: 4.8,
    reviewCount: 1243,
    tags: ['wireless', 'noise-cancelling', 'bluetooth', 'premium'],
    featured: true,
  },
  {
    name: 'Ultra-Slim Laptop 14" OLED',
    description: 'Power meets portability. This razor-thin laptop packs a stunning OLED display, the latest processor, and all-day battery life in a chassis under 1kg.',
    price: 1299.99,
    originalPrice: 1499.99,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'],
    category: 'Electronics',
    brand: 'TechCraft',
    stock: 18,
    rating: 4.6,
    reviewCount: 567,
    tags: ['laptop', 'oled', 'portable', 'work'],
    featured: true,
  },
  {
    name: 'Smart 4K Curved Monitor 32"',
    description: 'Stunning 4K resolution on a beautiful 32-inch curved panel. Perfect for work, gaming, and creative professionals who demand the best color accuracy.',
    price: 549.99,
    originalPrice: 699.99,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
    category: 'Electronics',
    brand: 'ViewMaster',
    stock: 12,
    rating: 4.5,
    reviewCount: 389,
    tags: ['monitor', '4k', 'curved', 'gaming'],
    featured: false,
  },
  {
    name: 'Mechanical Keyboard - RGB Backlit',
    description: 'Satisfying tactile typing with premium Cherry MX switches, full RGB customization, and aerospace-grade aluminum frame. Your desk setup just leveled up.',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600'],
    category: 'Electronics',
    brand: 'KeyMaster',
    stock: 60,
    rating: 4.7,
    reviewCount: 892,
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    featured: false,
  },
  {
    name: 'True Wireless Earbuds Elite',
    description: 'Audiophile-grade sound in a tiny package. Active noise cancellation, 8-hour battery with 24 more in the case, and IPX5 water resistance.',
    price: 179.99,
    originalPrice: 229.99,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    category: 'Electronics',
    brand: 'SoundElite',
    stock: 88,
    rating: 4.4,
    reviewCount: 1567,
    tags: ['earbuds', 'wireless', 'anc', 'sport'],
    featured: false,
  },
  // Clothing
  {
    name: 'Premium Merino Wool Sweater',
    description: 'Crafted from 100% superfine merino wool, this sweater offers exceptional softness, breathability, and natural temperature regulation. A wardrobe essential.',
    price: 89.99,
    originalPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600'],
    category: 'Clothing',
    brand: 'WoolCraft',
    stock: 35,
    rating: 4.9,
    reviewCount: 456,
    tags: ['merino', 'wool', 'sustainable', 'winter'],
    featured: true,
  },
  {
    name: 'Performance Running Shoes',
    description: 'Engineered for speed and comfort with responsive foam cushioning, breathable knit upper, and carbon fiber plate for maximum energy return.',
    price: 159.99,
    originalPrice: 199.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    category: 'Sports',
    brand: 'SpeedRun',
    stock: 42,
    rating: 4.7,
    reviewCount: 2341,
    tags: ['running', 'performance', 'carbon', 'marathon'],
    featured: true,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'A timeless wardrobe staple. Premium denim construction with subtle distressing, brass hardware, and a flattering relaxed fit that pairs with everything.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600'],
    category: 'Clothing',
    brand: 'DenimCo',
    stock: 55,
    rating: 4.3,
    reviewCount: 234,
    tags: ['denim', 'jacket', 'casual', 'classic'],
    featured: false,
  },
  // Home & Garden
  {
    name: 'Artisan Coffee Maker Pro',
    description: 'Brew café-quality coffee at home. Precision temperature control, bloom pre-infusion, and a stunning pour-over design that looks beautiful on any countertop.',
    price: 249.99,
    originalPrice: 299.99,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
    category: 'Home & Garden',
    brand: 'BrewMaster',
    stock: 23,
    rating: 4.8,
    reviewCount: 678,
    tags: ['coffee', 'kitchen', 'brew', 'home'],
    featured: false,
  },
  {
    name: 'Smart Indoor Plant Kit',
    description: 'Grow herbs and vegetables year-round with our self-watering smart garden. App-controlled LED grow lights and automated nutrient delivery for effortless growing.',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
    category: 'Home & Garden',
    brand: 'GreenThumb',
    stock: 31,
    rating: 4.5,
    reviewCount: 312,
    tags: ['garden', 'smart', 'indoor', 'herbs'],
    featured: false,
  },
  {
    name: 'Luxury Scented Candle Set',
    description: 'Hand-poured soy wax candles in three signature scents: Nordic Pine, Coastal Breeze, and Warm Vanilla. 50-hour burn time each.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1602874801007-bd458bb1a2c7?w=600'],
    category: 'Home & Garden',
    brand: 'AromaCraft',
    stock: 100,
    rating: 4.9,
    reviewCount: 1123,
    tags: ['candle', 'scent', 'luxury', 'gift'],
    featured: false,
  },
  // Books
  {
    name: 'The Art of Deep Work',
    description: 'A transformative guide to achieving focused success in a distracted world. Learn the science-backed techniques used by elite performers across every field.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
    category: 'Books',
    brand: 'PageTurner Press',
    stock: 200,
    rating: 4.6,
    reviewCount: 3456,
    tags: ['productivity', 'self-help', 'focus', 'business'],
    featured: false,
  },
  // Sports
  {
    name: 'Yoga Mat Premium Cork',
    description: 'Sustainable cork surface offers superior grip, natural antimicrobial properties, and a luxurious feel. Extra thick 6mm padding for joint protection.',
    price: 89.99,
    originalPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600'],
    category: 'Sports',
    brand: 'ZenFit',
    stock: 67,
    rating: 4.7,
    reviewCount: 892,
    tags: ['yoga', 'cork', 'eco', 'fitness'],
    featured: false,
  },
  {
    name: 'Adjustable Dumbbell Set 5-50kg',
    description: 'Replace 15 sets of weights with one compact pair. Quick-select dial adjusts in 2.5kg increments. Perfect for home gym enthusiasts at any level.',
    price: 349.99,
    originalPrice: 449.99,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600'],
    category: 'Sports',
    brand: 'IronEdge',
    stock: 14,
    rating: 4.8,
    reviewCount: 567,
    tags: ['dumbbell', 'adjustable', 'home gym', 'strength'],
    featured: false,
  },
  // Beauty
  {
    name: 'Vitamin C Brightening Serum',
    description: '20% stabilized Vitamin C with hyaluronic acid and ferulic acid. Visibly reduces dark spots, boosts radiance, and protects against environmental damage.',
    price: 59.99,
    originalPrice: 79.99,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    category: 'Beauty',
    brand: 'GlowLab',
    stock: 78,
    rating: 4.6,
    reviewCount: 2134,
    tags: ['skincare', 'vitamin-c', 'serum', 'brightening'],
    featured: false,
  },
  {
    name: 'Professional Hair Dryer 2400W',
    description: 'Salon-grade ionic technology reduces frizz and drying time by 50%. Lightweight ergonomic design with 3 heat settings and cool shot button.',
    price: 119.99,
    originalPrice: 159.99,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'],
    category: 'Beauty',
    brand: 'StylePro',
    stock: 44,
    rating: 4.5,
    reviewCount: 876,
    tags: ['hair', 'dryer', 'ionic', 'professional'],
    featured: false,
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    await Product.deleteMany({})
    console.log('Cleared existing products')

    const inserted = await Product.insertMany(products)
    console.log(`✅ Inserted ${inserted.length} products`)

    await mongoose.disconnect()
    console.log('Done!')
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
