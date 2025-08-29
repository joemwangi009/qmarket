import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // In production, this would verify user authentication
    // and return only their orders
    
    // const orders = await prisma.order.findMany({
    //   include: {
    //     items: {
    //       include: {
    //         product: true
    //       }
    //     },
    //     payment: true,
    //     shippingAddress: true
    //   },
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // })

    // Fetch orders with direct SQL query
    const ordersResult = await query(`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.subtotal,
        o.shipping,
        o.tax,
        o.payment_method,
        o.created_at,
        oi.name as item_name,
        oi.quantity,
        oi.price as item_price,
        sa.first_name,
        sa.last_name,
        sa.address,
        sa.city,
        sa.state,
        sa.zip_code,
        sa.country
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json(ordersResult.rows || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In production, this would:
    // 1. Verify user authentication
    // 2. Validate order data
    // 3. Create order in database
    // 4. Generate payment session with NOWPayments/Coinbase Commerce
    // 5. Return payment redirect URL
    
    const { items, shippingAddress, paymentMethod } = body
    
    // Calculate totals
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)
    const shipping = 0 // Free shipping
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax
    
    // Create order using direct SQL
    const orderId = `ORD-${Date.now()}`
    
    // Insert order
    const orderResult = await query(`
      INSERT INTO orders (id, status, subtotal, shipping, tax, total, payment_method, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [orderId, 'Pending', subtotal, shipping, tax, total, paymentMethod, new Date()])
    
    // Insert order items
    for (const item of items) {
      await query(`
        INSERT INTO order_items (order_id, name, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.name, item.quantity, item.price])
    }
    
    // Insert shipping address
    if (shippingAddress) {
      await query(`
        INSERT INTO shipping_addresses (order_id, first_name, last_name, address, city, state, zip_code, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [orderId, shippingAddress.firstName, shippingAddress.lastName, shippingAddress.address, 
          shippingAddress.city, shippingAddress.state, shippingAddress.zipCode, shippingAddress.country])
    }
    
    // Generate NOWPayments payment URL
    const paymentRedirectUrl = `https://api.nowpayments.io/v1/payment?api_key=${process.env.NOWPAYMENTS_API_KEY}&amount=${total}&currency_from=USD&currency_to=BTC&order_id=${orderId}`
    
    return NextResponse.json({
      order: orderResult.rows[0],
      paymentRedirectUrl,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 