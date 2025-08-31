import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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
      WHERE slug = $1 AND status = 'active'
    `

    const result = await query(sql, [slug])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0] as {
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
    }

    const product = {
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
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
} 