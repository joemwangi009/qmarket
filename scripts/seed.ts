import 'dotenv/config'
import { query } from '../src/lib/db'

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Insert sample products
    const products = [
      {
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        price: 299.99,
        category: 'Electronics',
        inventory: 45,
        specifications: {
          'Bluetooth Version': '5.0',
          'Battery Life': '30 hours',
          'Noise Cancellation': 'Active',
          'Driver Size': '40mm'
        }
      },
      {
        name: 'Mechanical Keyboard',
        slug: 'mechanical-keyboard',
        description: 'Professional mechanical keyboard with customizable RGB lighting and premium switches.',
        price: 159.99,
        category: 'Electronics',
        inventory: 23,
        specifications: {
          'Switch Type': 'Cherry MX Brown',
          'Layout': 'Full-size',
          'Backlighting': 'RGB',
          'Connectivity': 'USB-C'
        }
      },
      {
        name: 'Designer Backpack',
        slug: 'designer-backpack',
        description: 'Stylish and functional backpack perfect for everyday use and travel.',
        price: 89.99,
        category: 'Fashion',
        inventory: 67,
        specifications: {
          'Material': 'Water-resistant canvas',
          'Capacity': '25L',
          'Compartments': 'Multiple',
          'Laptop Sleeve': 'Yes'
        }
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Professional running shoes with advanced cushioning and breathable design.',
        price: 129.99,
        category: 'Sports & Fitness',
        inventory: 34,
        specifications: {
          'Type': 'Road running',
          'Cushioning': 'High',
          'Weight': '280g',
          'Drop': '8mm'
        }
      }
    ]

    for (const product of products) {
      await query(`
        INSERT INTO products (name, slug, description, price, category, inventory, specifications)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug) DO NOTHING
      `, [product.name, product.slug, product.description, product.price, product.category, product.inventory, product.specifications])
    }
    console.log('✓ Sample products inserted')

    // Insert sample user (admin)
    await query(`
      INSERT INTO users (email, role)
      VALUES ('admin@qmarket.com', 'admin')
      ON CONFLICT (email) DO NOTHING
    `)
    console.log('✓ Admin user created')

    // Insert sample orders
    const orders = [
      {
        id: 'ORD-001',
        status: 'Delivered',
        subtotal: 274.99,
        shipping: 0,
        tax: 25.00,
        total: 299.99,
        payment_method: 'BTC'
      },
      {
        id: 'ORD-002',
        status: 'Shipped',
        subtotal: 159.99,
        shipping: 0,
        tax: 12.80,
        total: 172.79,
        payment_method: 'ETH'
      }
    ]

    for (const order of orders) {
      await query(`
        INSERT INTO orders (id, status, subtotal, shipping, tax, total, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING
      `, [order.id, order.status, order.subtotal, order.shipping, order.tax, order.total, order.payment_method])
    }
    console.log('✓ Sample orders created')

    // Insert sample order items
    await query(`
      INSERT INTO order_items (order_id, name, quantity, price)
      VALUES 
        ('ORD-001', 'Premium Wireless Headphones', 1, 274.99),
        ('ORD-002', 'Mechanical Keyboard', 1, 159.99)
      ON CONFLICT DO NOTHING
    `)
    console.log('✓ Sample order items created')

    // Insert sample shipping addresses
    await query(`
      INSERT INTO shipping_addresses (order_id, first_name, last_name, address, city, state, zip_code, country)
      VALUES 
        ('ORD-001', 'John', 'Doe', '123 Main St', 'New York', 'NY', '10001', 'US'),
        ('ORD-002', 'Jane', 'Smith', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'US')
      ON CONFLICT DO NOTHING
    `)
    console.log('✓ Sample shipping addresses created')

    // Insert sample payments
    await query(`
      INSERT INTO payments (order_id, transaction_hash, amount, currency, status, gateway)
      VALUES 
        ('ORD-001', '0x1234567890abcdef1234567890abcdef12345678', 299.99, 'USD', 'completed', 'nowpayments'),
        ('ORD-002', '0xabcdef1234567890abcdef1234567890abcdef12', 172.79, 'USD', 'completed', 'nowpayments')
      ON CONFLICT DO NOTHING
    `)
    console.log('✓ Sample payments created')

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Sample data includes:')
    console.log('   - 4 products across different categories')
    console.log('   - 1 admin user (admin@qmarket.com)')
    console.log('   - 2 sample orders with items and addresses')
    console.log('   - Sample payment records')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase() 