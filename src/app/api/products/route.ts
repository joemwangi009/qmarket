import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let whereClause = 'WHERE status = $1'
    const params: (string | number | boolean)[] = ['active']
    let paramIndex = 2

    if (category) {
      whereClause += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (featured === 'true') {
      whereClause += ` AND featured = $${paramIndex}`
      params.push(true)
      paramIndex++
    }

    if (inStock === 'true') {
      whereClause += ` AND in_stock = $${paramIndex}`
      params.push(true)
      paramIndex++
    }

    const sql = `
      SELECT 
        id,
        name,
        slug,
        description,
        price,
        original_price,
        image,
        category,
        tags,
        in_stock,
        rating,
        review_count,
        featured,
        created_at,
        updated_at
      FROM products 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)

    const result = await query(sql, params)
    
    // Transform database fields to match our Product interface
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      image: row.image,
      category: row.category,
      tags: row.tags || [],
      inStock: row.in_stock,
      rating: row.rating ? parseFloat(row.rating) : undefined,
      reviewCount: row.review_count || 0,
      featured: row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        limit,
        offset,
        total: products.length
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 