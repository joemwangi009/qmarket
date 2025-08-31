import 'dotenv/config'
import { query } from '../src/lib/db'

async function createTables() {
  try {
    console.log('Starting database migration...')

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Users table created')

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        image VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        tags TEXT[],
        in_stock BOOLEAN DEFAULT true,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Products table created')

    // Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(500),
        parent_id UUID REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Categories table created')

    // Create orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        shipping DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Orders table created')

    // Create order_items table
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Order items table created')

    // Create shipping_addresses table
    await query(`
      CREATE TABLE IF NOT EXISTS shipping_addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Shipping addresses table created')

    // Create payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        transaction_hash VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        gateway VARCHAR(50) DEFAULT 'nowpayments',
        gateway_response JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Payments table created')

    // Create indexes for better performance
    await query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)')
    await query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)')
    await query('CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)')
    await query('CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)')
    await query('CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock)')
    await query('CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)')
    await query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_payments_transaction_hash ON payments(transaction_hash)')
    console.log('✓ Database indexes created')

    console.log('🎉 Database migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

createTables()