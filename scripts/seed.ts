import 'dotenv/config'
import { query } from '../src/lib/db'

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Clear existing data
    await query('DELETE FROM order_items')
    await query('DELETE FROM payments')
    await query('DELETE FROM shipping_addresses')
    await query('DELETE FROM orders')
    await query('DELETE FROM products')
    await query('DELETE FROM categories')
    await query('DELETE FROM users')
    console.log('✓ Existing data cleared')

    // Create admin user
    const adminUser = await query(`
      INSERT INTO users (email, password_hash, role) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `, ['admin@qmarket.com', 'admin_hash_placeholder', 'admin'])
    console.log('✓ Admin user created')

    // Create categories
    const categories = [
      { name: 'Electronics', description: 'Latest gadgets and electronic devices', slug: 'electronics', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { name: 'Fashion', description: 'Trendy clothing and accessories', slug: 'fashion', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { name: 'Home & Garden', description: 'Everything for your home and garden', slug: 'home-garden', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { name: 'Sports & Outdoors', description: 'Equipment for active lifestyle', slug: 'sports-outdoors', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { name: 'Beauty & Health', description: 'Personal care and wellness products', slug: 'beauty-health', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { name: 'Books & Media', description: 'Books, movies, and digital content', slug: 'books-media', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' }
    ]

    for (const category of categories) {
      await query(`
        INSERT INTO categories (name, description, slug, image) 
        VALUES ($1, $2, $3, $4)
      `, [category.name, category.description, category.slug, category.image])
    }
    console.log('✓ Categories created')

    // Create products
    const products = [
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['wireless', 'bluetooth', 'noise-canceling', 'headphones'],
        inStock: true,
        rating: 4.8,
        reviewCount: 1247,
        featured: true
      },
      {
        name: 'Smart Fitness Watch',
        slug: 'smart-fitness-watch',
        description: 'Advanced fitness tracker with heart rate monitoring and GPS',
        price: 199.99,
        originalPrice: 299.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['smartwatch', 'fitness', 'health', 'tracking'],
        inStock: true,
        rating: 4.6,
        reviewCount: 892,
        featured: true
      },
      {
        name: 'Portable Bluetooth Speaker',
        slug: 'portable-bluetooth-speaker',
        description: 'Waterproof portable speaker with 360-degree sound',
        price: 59.99,
        originalPrice: 89.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['portable', 'bluetooth', 'speaker', 'waterproof'],
        inStock: true,
        rating: 4.7,
        reviewCount: 1563,
        featured: false
      },
      {
        name: 'Wireless Charging Pad',
        slug: 'wireless-charging-pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
        price: 29.99,
        originalPrice: 49.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['wireless', 'charging', 'qi', 'fast-charging'],
        inStock: true,
        rating: 4.5,
        reviewCount: 734,
        featured: false
      },
      {
        name: 'USB-C Power Bank',
        slug: 'usb-c-power-bank',
        description: '20000mAh power bank with USB-C and wireless charging',
        price: 49.99,
        originalPrice: 79.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['power-bank', 'usb-c', 'wireless-charging', 'portable'],
        inStock: true,
        rating: 4.4,
        reviewCount: 567,
        featured: false
      },
      {
        name: 'Wireless Gaming Mouse',
        slug: 'wireless-gaming-mouse',
        description: 'High-precision wireless gaming mouse with RGB lighting',
        price: 79.99,
        originalPrice: 119.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Electronics',
        tags: ['gaming', 'wireless', 'rgb', 'precision'],
        inStock: true,
        rating: 4.9,
        reviewCount: 2103,
        featured: true
      },
      // Fashion
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        description: '100% organic cotton t-shirt with modern fit',
        price: 29.99,
        originalPrice: 39.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Fashion',
        tags: ['cotton', 'organic', 'tshirt', 'casual'],
        inStock: true,
        rating: 4.6,
        reviewCount: 445,
        featured: false
      },
      {
        name: 'Designer Jeans',
        slug: 'designer-jeans',
        description: 'Premium denim jeans with perfect fit and style',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Fashion',
        tags: ['jeans', 'denim', 'designer', 'premium'],
        inStock: true,
        rating: 4.7,
        reviewCount: 678,
        featured: false
      },
      // Home & Garden
      {
        name: 'Smart LED Light Bulb',
        slug: 'smart-led-light-bulb',
        description: 'WiFi-enabled smart bulb with 16 million colors',
        price: 15.99,
        originalPrice: 24.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Home & Garden',
        tags: ['smart', 'led', 'wifi', 'colors'],
        inStock: true,
        rating: 4.3,
        reviewCount: 234,
        featured: false
      },
      {
        name: 'Bamboo Cutting Board',
        slug: 'bamboo-cutting-board',
        description: 'Eco-friendly bamboo cutting board with juice groove',
        price: 32.99,
        originalPrice: 44.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Home & Garden',
        tags: ['bamboo', 'cutting-board', 'eco-friendly', 'kitchen'],
        inStock: true,
        rating: 4.8,
        reviewCount: 156,
        featured: false
      },
      // Sports & Outdoors
      {
        name: 'Running Shoes Elite',
        slug: 'running-shoes-elite',
        description: 'Professional running shoes with advanced cushioning',
        price: 189.99,
        originalPrice: 249.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Sports & Outdoors',
        tags: ['running', 'shoes', 'professional', 'cushioning'],
        inStock: true,
        rating: 4.7,
        reviewCount: 892,
        featured: true
      },
      {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip yoga mat with alignment lines',
        price: 45.99,
        originalPrice: 59.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Sports & Outdoors',
        tags: ['yoga', 'mat', 'non-slip', 'alignment'],
        inStock: true,
        rating: 4.5,
        reviewCount: 334,
        featured: false
      },
      // Beauty & Health
      {
        name: 'Organic Face Serum',
        slug: 'organic-face-serum',
        description: 'Natural anti-aging serum with vitamin C and hyaluronic acid',
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Beauty & Health',
        tags: ['organic', 'serum', 'anti-aging', 'vitamin-c'],
        inStock: true,
        rating: 4.9,
        reviewCount: 567,
        featured: true
      },
      {
        name: 'Electric Toothbrush',
        slug: 'electric-toothbrush',
        description: 'Smart electric toothbrush with Bluetooth connectivity',
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        category: 'Beauty & Health',
        tags: ['electric', 'toothbrush', 'smart', 'bluetooth'],
        inStock: true,
        rating: 4.6,
        reviewCount: 445,
        featured: false
      }
    ]

    for (const product of products) {
      await query(`
        INSERT INTO products (name, slug, description, price, original_price, image, category, tags, in_stock, rating, review_count, featured) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        product.name, product.slug, product.description, product.price, 
        product.originalPrice, product.image, product.category, product.tags,
        product.inStock, product.rating, product.reviewCount, product.featured
      ])
    }
    console.log('✓ Products created')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`Created ${categories.length} categories and ${products.length} products`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase() 