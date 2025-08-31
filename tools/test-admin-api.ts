import 'dotenv/config'

async function testAdminAPI() {
  try {
    console.log('Testing admin auth API endpoint...')
    
    const response = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'admin@qmarket.com', 
        password: 'Admin@123' 
      }),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Response:', data)
    } else {
      const errorText = await response.text()
      console.log('❌ API Error:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error)
  }
}

testAdminAPI() 