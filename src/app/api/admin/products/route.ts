import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Fetch all products for admin (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: (string | number | boolean)[] = []
    let paramIndex = 1

    if (status && status !== 'all') {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (category && category !== 'all') {
      whereClause += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR sku ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    // Get total count
    const countSql = `SELECT COUNT(*) FROM products ${whereClause}`
    const countResult = await query(countSql, params)
    const totalCount = parseInt(countResult.rows[0].count)

    // Get products with pagination
    const sql = `
      SELECT 
        id,
        name,
        slug,
        description,
        short_description,
        price,
        original_price,
        cost_price,
        sku,
        stock,
        min_stock,
        max_stock,
        weight,
        length,
        width,
        height,
        brand,
        category,
        subcategory,
        tags,
        images,
        status,
        featured,
        visibility,
        launch_date,
        meta_title,
        meta_description,
        keywords,
        is_digital,
        download_url,
        license_key,
        is_subscription,
        subscription_interval,
        subscription_price,
        is_pre_order,
        pre_order_date,
        pre_order_price,
        variations,
        attributes,
        created_at,
        updated_at
      FROM products 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)
    const result = await query(sql, params)

    // Transform database fields to match our Product interface
    const products = result.rows.map(row => ({
      id: row.id,
      title: row.name,
      description: row.description,
      shortDescription: row.short_description || '',
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      costPrice: row.cost_price ? parseFloat(row.cost_price) : undefined,
      sku: row.sku,
      stock: row.stock || 0,
      minStock: row.min_stock || 5,
      maxStock: row.max_stock || 1000,
      weight: row.weight || 0,
      dimensions: {
        length: row.length || 0,
        width: row.width || 0,
        height: row.height || 0
      },
      brand: row.brand || '',
      category: row.category || '',
      subcategory: row.subcategory || '',
      tags: row.tags || [],
      images: row.images || [],
      status: row.status || 'draft',
      featured: row.featured || false,
      visibility: row.visibility || 'public',
      launchDate: row.launch_date || '',
      seo: {
        metaTitle: row.meta_title || row.name,
        metaDescription: row.meta_description || row.description,
        slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        keywords: row.keywords || []
      },
      isDigital: row.is_digital || false,
      downloadUrl: row.download_url || '',
      licenseKey: row.license_key || '',
      isSubscription: row.is_subscription || false,
      subscriptionInterval: row.subscription_interval || 'monthly',
      subscriptionPrice: row.subscription_price || 0,
      isPreOrder: row.is_pre_order || false,
      preOrderDate: row.pre_order_date || '',
      preOrderPrice: row.pre_order_price || 0,
      variations: row.variations || {},
      attributes: row.attributes || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      shortDescription,
      price,
      originalPrice,
      costPrice,
      sku,
      stock,
      minStock,
      maxStock,
      weight,
      length,
      width,
      height,
      brand,
      category,
      subcategory,
      tags,
      images,
      status,
      featured,
      visibility,
      launchDate,
      metaTitle,
      metaDescription,
      slug,
      keywords,
      isDigital,
      downloadUrl,
      licenseKey,
      isSubscription,
      subscriptionInterval,
      subscriptionPrice,
      isPreOrder,
      preOrderDate,
      preOrderPrice,
      variations,
      attributes
    } = body

    // Validate required fields
    if (!title || !sku || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Title, SKU, and price are required' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingSku = await query('SELECT id FROM products WHERE sku = $1', [sku])
    if (existingSku.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      )
    }

    const sql = `
      INSERT INTO products (
        name, description, short_description, price, original_price, cost_price,
        sku, stock, min_stock, max_stock, weight, length, width, height,
        brand, category, subcategory, tags, images, status, featured,
        visibility, launch_date, meta_title, meta_description, slug, keywords,
        is_digital, download_url, license_key, is_subscription, subscription_interval,
        subscription_price, is_pre_order, pre_order_date, pre_order_price,
        variations, attributes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
        $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40
      ) RETURNING id
    `

    const params = [
      title, description, shortDescription || '', price, originalPrice || null, costPrice || null,
      sku, stock || 0, minStock || 5, maxStock || 1000, weight || 0, length || 0, width || 0, height || 0,
      brand || '', category || '', subcategory || '', tags || [], images || [], status || 'draft', featured || false,
      visibility || 'public', launchDate || null, metaTitle || title, metaDescription || description, 
      slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), keywords || [],
      isDigital || false, downloadUrl || '', licenseKey || '', isSubscription || false, subscriptionInterval || 'monthly',
      subscriptionPrice || 0, isPreOrder || false, preOrderDate || null, preOrderPrice || 0,
      variations || {}, attributes || {}, new Date(), new Date()
    ]

    const result = await query(sql, params)
    const newProductId = result.rows[0].id

    return NextResponse.json({
      success: true,
      data: { id: newProductId },
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await query('SELECT id FROM products WHERE id = $1', [id])
    if (existingProduct.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if SKU is being changed and if new SKU already exists
    if (updateData.sku) {
      const existingSku = await query('SELECT id FROM products WHERE sku = $1 AND id != $2', [updateData.sku, id])
      if (existingSku.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Build dynamic update query
    const updateFields = []
    const params = []
    let paramIndex = 1

    // Map frontend fields to database fields
    const fieldMappings: Record<string, string> = {
      title: 'name',
      description: 'description',
      shortDescription: 'short_description',
      price: 'price',
      originalPrice: 'original_price',
      costPrice: 'cost_price',
      sku: 'sku',
      stock: 'stock',
      minStock: 'min_stock',
      maxStock: 'max_stock',
      weight: 'weight',
      length: 'length',
      width: 'width',
      height: 'height',
      brand: 'brand',
      category: 'category',
      subcategory: 'subcategory',
      tags: 'tags',
      images: 'images',
      status: 'status',
      featured: 'featured',
      visibility: 'visibility',
      launchDate: 'launch_date',
      metaTitle: 'meta_title',
      metaDescription: 'meta_description',
      slug: 'slug',
      keywords: 'keywords',
      isDigital: 'is_digital',
      downloadUrl: 'download_url',
      licenseKey: 'license_key',
      isSubscription: 'is_subscription',
      subscriptionInterval: 'subscription_interval',
      subscriptionPrice: 'subscription_price',
      isPreOrder: 'is_pre_order',
      preOrderDate: 'pre_order_date',
      preOrderPrice: 'pre_order_price',
      variations: 'variations',
      attributes: 'attributes'
    }

    Object.entries(updateData).forEach(([key, value]) => {
      if (fieldMappings[key] && value !== undefined) {
        updateFields.push(`${fieldMappings[key]} = $${paramIndex}`)
        params.push(value)
        paramIndex++
      }
    })

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = $' + paramIndex)
    params.push(new Date())

    // Add WHERE clause
    params.push(id)

    const sql = `
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex + 1}
      RETURNING id
    `

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await query('SELECT id FROM products WHERE id = $1', [id])
    if (existingProduct.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Soft delete - update status to 'deleted' instead of actually deleting
    await query('UPDATE products SET status = $1, updated_at = $2 WHERE id = $3', ['deleted', new Date(), id])

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 