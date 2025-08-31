import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')

    let sql = `
      SELECT 
        id,
        name,
        description,
        slug,
        image,
        parent_id,
        created_at,
        updated_at
      FROM categories 
      WHERE parent_id IS NULL
      ORDER BY name ASC
    `

    let params: (string | null)[] = []

    if (parentId) {
      sql = `
        SELECT 
          id,
          name,
          description,
          slug,
          image,
          parent_id,
          created_at,
          updated_at
        FROM categories 
        WHERE parent_id = $1
        ORDER BY name ASC
      `
      params = [parentId]
    }

    const result = await query(sql, params)
    
    // Transform database fields to match our Category interface
    const categories = (result.rows as Array<{
      id: string
      name: string
      description: string
      slug: string
      image: string | null
      parent_id: string | null
      created_at: Date
      updated_at: Date
    }>).map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      slug: row.slug,
      image: row.image,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 