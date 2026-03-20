import { describe, it, expect } from 'vitest'
import { getProducts, searchProducts, addProduct } from '@/api/products.api'

describe('Products API', () => {
  describe('getProducts', () => {
    it('should return products list with pagination info', async () => {
      const result = await getProducts({ limit: 20, skip: 0 })

      expect(result.products).toHaveLength(1)
      expect(result.total).toBe(194)
      expect(result.skip).toBe(0)
      expect(result.limit).toBe(20)
    })

    it('should pass sort params to API', async () => {
      const result = await getProducts({ sortBy: 'price', order: 'asc' })

      expect(result.products).toBeDefined()
      expect(result.products.length).toBeGreaterThan(0)
    })

    it('should return products with correct structure', async () => {
      const result = await getProducts()
      const product = result.products[0]

      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('title')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('rating')
      expect(product).toHaveProperty('brand')
      expect(product).toHaveProperty('sku')
      expect(product).toHaveProperty('stock')
      expect(product).toHaveProperty('thumbnail')
      expect(product).toHaveProperty('category')
    })
  })

  describe('searchProducts', () => {
    it('should return matching products for a query', async () => {
      const result = await searchProducts('mascara')

      expect(result.products).toBeDefined()
      expect(Array.isArray(result.products)).toBe(true)
    })

    it('should include pagination info in search results', async () => {
      const result = await searchProducts('test')

      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('skip')
      expect(result).toHaveProperty('limit')
    })
  })

  describe('addProduct', () => {
    it('should return created product with an id', async () => {
      const newProduct = {
        title: 'Test Product',
        price: 99.99,
        brand: 'TestBrand',
        sku: 'TEST-001',
      }

      const result = await addProduct(newProduct)

      expect(result.id).toBe(195)
      expect(result.title).toBe('Test Product')
      expect(result.price).toBe(99.99)
      expect(result.brand).toBe('TestBrand')
      expect(result.sku).toBe('TEST-001')
    })
  })
})
