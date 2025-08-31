import 'dotenv/config'
import { query } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function insertUsers() {
  try {
    console.log('Starting user insertion...')

    // Hash passwords
    const adminPassword = 'Admin@123'
    const userPassword = 'User@123'
    
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12)
    const userPasswordHash = await bcrypt.hash(userPassword, 12)

    // Insert admin user
    await query(`
      INSERT INTO users (email, password_hash, role) 
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
    `, ['admin@qmarket.com', adminPasswordHash, 'admin'])
    console.log('✓ Admin user created/updated')

    // Insert regular users
    const regularUsers = [
      ['john.doe@example.com', userPasswordHash, 'user'],
      ['jane.smith@example.com', userPasswordHash, 'user'],
      ['mike.wilson@example.com', userPasswordHash, 'user'],
      ['sarah.jones@example.com', userPasswordHash, 'user'],
      ['david.brown@example.com', userPasswordHash, 'user'],
      ['emma.davis@example.com', userPasswordHash, 'user'],
      ['alex.taylor@example.com', userPasswordHash, 'user'],
      ['lisa.garcia@example.com', userPasswordHash, 'user'],
      ['tom.anderson@example.com', userPasswordHash, 'user'],
      ['anna.white@example.com', userPasswordHash, 'user']
    ]

    for (const [email, passwordHash, role] of regularUsers) {
      await query(`
        INSERT INTO users (email, password_hash, role) 
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO UPDATE SET 
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role
      `, [email, passwordHash, role])
    }
    console.log('✓ Regular users created/updated')

    // Display admin credentials
    console.log('\n🎯 ADMIN DASHBOARD ACCESS CREDENTIALS:')
    console.log('=====================================')
    console.log('Email: admin@qmarket.com')
    console.log('Password: Admin@123')
    console.log('Role: admin')
    console.log('=====================================')
    console.log('\n📧 REGULAR USER CREDENTIALS:')
    console.log('=====================================')
    console.log('Email: john.doe@example.com')
    console.log('Password: User@123')
    console.log('Role: user')
    console.log('=====================================')
    console.log('\n💡 You can use any of the regular user emails with password: User@123')
    console.log('💡 For admin access, use: admin@qmarket.com with password: Admin@123')

    console.log('\n🎉 User insertion completed successfully!')
  } catch (error) {
    console.error('❌ User insertion failed:', error)
    process.exit(1)
  }
}

insertUsers() 