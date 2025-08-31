import 'dotenv/config'
import { query } from '../src/lib/db'

async function checkTables() {
  try {
    console.log('Checking database tables...')
    
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log('Tables found:')
    ;(result.rows as { table_name: string }[]).forEach(row => {
      console.log(`- ${row.table_name}`)
    })
    
  } catch (error) {
    console.error('Error checking tables:', error)
  }
}

checkTables() 