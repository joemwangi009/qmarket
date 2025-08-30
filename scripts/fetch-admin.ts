import 'dotenv/config'
import { query } from '../src/lib/db'

interface User {
  id: string
  email: string
  role: string
  created_at: Date
  updated_at: Date
}

async function fetchAdminDetails() {
  try {
    console.log('🔍 Fetching admin user details from database...')
    console.log('')

    // Fetch all admin users
    const adminUsers = await query(`
      SELECT 
        id,
        email,
        role,
        created_at,
        updated_at
      FROM users 
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `)

    if (adminUsers.rows.length === 0) {
      console.log('❌ No admin users found in the database.')
      console.log('💡 You may need to run the seed script first: npm run db:seed')
      return
    }

    console.log(`✅ Found ${adminUsers.rows.length} admin user(s):`)
    console.log('')

    ;(adminUsers.rows as User[]).forEach((user, index) => {
      console.log(`👤 Admin User #${index + 1}:`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.created_at}`)
      console.log(`   Updated: ${user.updated_at}`)
      console.log('')
    })

    // Fetch all users for comparison
    const allUsers = await query(`
      SELECT 
        email,
        role,
        created_at
      FROM users 
      ORDER BY role DESC, created_at DESC
    `)

    console.log(`📊 Database Summary:`)
    console.log(`   Total Users: ${allUsers.rows.length}`)
    console.log(`   Admin Users: ${adminUsers.rows.length}`)
    console.log(`   Regular Users: ${allUsers.rows.length - adminUsers.rows.length}`)
    console.log('')

    // Show login instructions
    console.log('🔑 Login Information:')
    console.log('   Email: admin@qmarket.com')
    console.log('   Role: admin')
    console.log('   Note: This user was created without a password hash')
    console.log('')
    console.log('⚠️  Security Note:')
    console.log('   The admin user currently has no password set.')
    console.log('   You should set a secure password for production use.')
    console.log('')

  } catch (error) {
    console.error('❌ Error fetching admin details:', error)
    process.exit(1)
  }
}

fetchAdminDetails() 