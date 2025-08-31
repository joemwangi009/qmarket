import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!searchQuery) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
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
      WHERE status = 'active' 
        AND (
          name ILIKE $1 
          OR description ILIKE $1 
          OR category ILIKE $1
          OR tags::text ILIKE $1
        )
      ORDER BY 
        CASE 
          WHEN name ILIKE $1 THEN 1
          WHEN category ILIKE $1 THEN 2
          WHEN tags::text ILIKE $1 THEN 3
          ELSE 4
        END,
        rating DESC NULLS LAST,
        review_count DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `

    const searchPattern = `%${searchQuery}%`
    const result = await query(sql, [searchPattern, limit, offset])
    
    // Transform database fields to match our Product interface
    const products = (result.rows as Array<{
      id: string
      name: string
      slug: string
      description: string
      price: string
      original_price: string | null
      image: string
      category: string
      tags: string[] | null
      in_stock: boolean
      rating: string | null
      review_count: number | null
      featured: boolean
      created_at: Date
      updated_at: Date
    }>).map(row => ({
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
    console.error('Error searching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    )
  }
} 