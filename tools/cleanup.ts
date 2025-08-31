import 'dotenv/config'
import { query } from '../src/lib/db'

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...')

    // Drop tables in reverse order (due to foreign key constraints)
    await query('DROP TABLE IF EXISTS payments CASCADE')
    await query('DROP TABLE IF EXISTS shipping_addresses CASCADE')
    await query('DROP TABLE IF EXISTS order_items CASCADE')
    await query('DROP TABLE IF EXISTS orders CASCADE')
    await query('DROP TABLE IF EXISTS products CASCADE')
    await query('DROP TABLE IF EXISTS categories CASCADE')
    await query('DROP TABLE IF EXISTS users CASCADE')
    
    console.log('✓ All tables dropped successfully')
    console.log('🎉 Database cleanup completed!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

cleanupDatabase() 