import 'dotenv/config'
import { query } from '../src/lib/db'

async function testDatabase() {
  try {
    console.log('Testing database...')
    
    // Check products
    const products = await query('SELECT COUNT(*) as count FROM products')
    console.log(`Products count: ${(products.rows[0] as { count: string }).count}`)
    
    // Check categories
    const categories = await query('SELECT COUNT(*) as count FROM categories')
    console.log(`Categories count: ${(categories.rows[0] as { count: string }).count}`)
    
    // Check users
    const users = await query('SELECT COUNT(*) as count FROM users')
    console.log(`Users count: ${(users.rows[0] as { count: string }).count}`)
    
    if (parseInt(products.rows[0].count) === 0) {
      console.log('No products found. Running seed...')
      const { execSync } = require('child_process')
      execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' })
    }
    
  } catch (error) {
    console.error('Error testing database:', error)
  }
}

testDatabase() 