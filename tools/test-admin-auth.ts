import 'dotenv/config'
import { query } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function testAdminAuth() {
  try {
    console.log('Testing admin authentication...')

    // Check if admin user exists
    const result = await query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      ['admin@qmarket.com']
    )

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database')
      return
    }

    const adminUser = result.rows[0]
    console.log('✅ Admin user found:')
    console.log('  ID:', adminUser.id)
    console.log('  Email:', adminUser.email)
    console.log('  Role:', adminUser.role)
    console.log('  Password hash length:', adminUser.password_hash?.length || 0)

    // Test password verification
    const testPassword = 'Admin@123'
    const isValidPassword = await bcrypt.compare(testPassword, adminUser.password_hash)
    
    console.log('\n🔐 Password verification test:')
    console.log('  Test password:', testPassword)
    console.log('  Password valid:', isValidPassword)

    if (isValidPassword) {
      console.log('✅ Password verification successful!')
    } else {
      console.log('❌ Password verification failed!')
      
      // Let's check what the actual hash looks like
      console.log('\n🔍 Password hash details:')
      console.log('  Hash:', adminUser.password_hash)
      
      // Try to create a new hash and compare
      const newHash = await bcrypt.hash(testPassword, 12)
      console.log('  New hash for same password:', newHash)
      
      const newHashValid = await bcrypt.compare(testPassword, newHash)
      console.log('  New hash verification:', newHashValid)
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAdminAuth() 