import { Product, Category } from '@/types'

const API_BASE = '/api'

export async function fetchProducts(params: {
  category?: string
  featured?: boolean
  inStock?: boolean
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
} = {}): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams()
    
    if (params.category) searchParams.append('category', params.category)
    if (params.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params.inStock !== undefined) searchParams.append('inStock', params.inStock.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.offset) searchParams.append('offset', params.offset.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const response = await fetch(`${API_BASE}/products?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function fetchCategories(params: {
  parentId?: string
} = {}): Promise<Category[]> {
  try {
    const searchParams = new URLSearchParams()
    
    if (params.parentId) searchParams.append('parentId', params.parentId)

    const response = await fetch(`${API_BASE}/categories?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return fetchProducts({ featured: true, limit, sortBy: 'rating', sortOrder: 'desc' })
}

export async function fetchBestSellingProducts(limit: number = 6): Promise<Product[]> {
  return fetchProducts({ inStock: true, limit, sortBy: 'rating', sortOrder: 'desc' })
}

export async function fetchProductsByCategory(category: string, limit: number = 8): Promise<Product[]> {
  return fetchProducts({ category, limit, inStock: true })
}

export async function fetchPopularProducts(limit: number = 8): Promise<Product[]> {
  return fetchProducts({ inStock: true, limit, sortBy: 'review_count', sortOrder: 'desc' })
}

export async function fetchTodaysDeals(limit: number = 6): Promise<Product[]> {
  // For now, return featured products with discounts
  // In the future, this could be a separate deals table
  return fetchProducts({ featured: true, limit, sortBy: 'created_at', sortOrder: 'desc' })
}

export async function fetchFreeShippingProducts(limit: number = 8): Promise<Product[]> {
  // For now, return products under $50 (assuming free shipping threshold)
  // In the future, this could be a separate shipping rules table
  const products = await fetchProducts({ limit: 20, inStock: true })
  return products.filter(p => p.price < 50).slice(0, limit)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE}/products/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || null
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams()
    searchParams.append('search', query)
    searchParams.append('limit', limit.toString())

    const response = await fetch(`${API_BASE}/products/search?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
} 