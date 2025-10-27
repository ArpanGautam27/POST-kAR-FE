import { describe, it, expect, beforeEach } from 'vitest'
import { MockProductService } from '../MockProductService'
import type { Product } from '../../types'

describe('MockProductService', () => {
  let service: MockProductService

  beforeEach(() => {
    service = MockProductService.getInstance()
  })

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products = await service.getProducts()
      
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('should return products with expected data structure', async () => {
      const products = await service.getProducts()
      
      products.forEach((product: Product) => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('description')
        expect(product).toHaveProperty('thumbnail_url')
        expect(product).toHaveProperty('image_url')
        expect(product).toHaveProperty('image_id')
        expect(product).toHaveProperty('video_url')
        
        // Validate required string fields are not empty
        expect(typeof product.id).toBe('string')
        expect(product.id.length).toBeGreaterThan(0)
        expect(typeof product.name).toBe('string')
        expect(product.name.length).toBeGreaterThan(0)
        expect(typeof product.description).toBe('string')
        expect(product.description.length).toBeGreaterThan(0)
        expect(typeof product.thumbnail_url).toBe('string')
        expect(product.thumbnail_url.length).toBeGreaterThan(0)
        expect(typeof product.image_url).toBe('string')
        expect(product.image_url.length).toBeGreaterThan(0)
        expect(typeof product.image_id).toBe('string')
        expect(product.image_id.length).toBeGreaterThan(0)
        expect(typeof product.video_url).toBe('string')
        expect(product.video_url.length).toBeGreaterThan(0)
      })
    })

    it('should return products with valid metadata structure when present', async () => {
      const products = await service.getProducts()
      
      products.forEach((product: Product) => {
        if (product.metadata) {
          expect(typeof product.metadata).toBe('object')
          
          if (product.metadata.category) {
            expect(typeof product.metadata.category).toBe('string')
          }
          
          if (product.metadata.tags) {
            expect(Array.isArray(product.metadata.tags)).toBe(true)
            product.metadata.tags.forEach(tag => {
              expect(typeof tag).toBe('string')
            })
          }
          
          if (product.metadata.created_at) {
            expect(typeof product.metadata.created_at).toBe('string')
            // Validate ISO date format
            expect(() => new Date(product.metadata!.created_at!)).not.toThrow()
          }
        }
      })
    })

    it('should return between 8-12 products as specified in requirements', async () => {
      const products = await service.getProducts()
      
      expect(products.length).toBeGreaterThanOrEqual(8)
      expect(products.length).toBeLessThanOrEqual(12)
    })

    it('should return a copy of products array (not reference)', async () => {
      const products1 = await service.getProducts()
      const products2 = await service.getProducts()
      
      expect(products1).not.toBe(products2) // Different array references
      expect(products1).toEqual(products2) // Same content
    })

    it('should simulate network delay', async () => {
      const startTime = Date.now()
      await service.getProducts()
      const endTime = Date.now()
      
      // Should take at least 250ms (allowing for some variance)
      expect(endTime - startTime).toBeGreaterThanOrEqual(250)
    })
  })

  describe('getProduct', () => {
    it('should return a product when given a valid ID', async () => {
      const products = await service.getProducts()
      const validId = products[0].id
      
      const product = await service.getProduct(validId)
      
      expect(product).not.toBeNull()
      expect(product!.id).toBe(validId)
    })

    it('should return null when given an invalid ID', async () => {
      const invalidId = 'invalid-product-id'
      
      const product = await service.getProduct(invalidId)
      
      expect(product).toBeNull()
    })

    it('should return a copy of the product (not reference)', async () => {
      const products = await service.getProducts()
      const validId = products[0].id
      
      const product1 = await service.getProduct(validId)
      const product2 = await service.getProduct(validId)
      
      expect(product1).not.toBe(product2) // Different object references
      expect(product1).toEqual(product2) // Same content
    })

    it('should return product with expected data structure', async () => {
      const products = await service.getProducts()
      const validId = products[0].id
      
      const product = await service.getProduct(validId)
      
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('description')
      expect(product).toHaveProperty('thumbnail_url')
      expect(product).toHaveProperty('image_url')
      expect(product).toHaveProperty('image_id')
      expect(product).toHaveProperty('video_url')
    })

    it('should handle empty string ID', async () => {
      const product = await service.getProduct('')
      
      expect(product).toBeNull()
    })

    it('should handle undefined ID gracefully', async () => {
      const product = await service.getProduct(undefined as any)
      
      expect(product).toBeNull()
    })

    it('should simulate network delay', async () => {
      const products = await service.getProducts()
      const validId = products[0].id
      
      const startTime = Date.now()
      await service.getProduct(validId)
      const endTime = Date.now()
      
      // Should take at least 150ms (allowing for some variance)
      expect(endTime - startTime).toBeGreaterThanOrEqual(150)
    })
  })

  describe('getProductMedia', () => {
    it('should return media response for valid image ID', async () => {
      const products = await service.getProducts()
      const validImageId = products[0].image_id
      
      const mediaResponse = await service.getProductMedia(validImageId)
      
      expect(mediaResponse).toHaveProperty('data')
      expect(mediaResponse).toHaveProperty('success')
      expect(mediaResponse.success).toBe(true)
      expect(mediaResponse.data).toHaveProperty('url')
      expect(mediaResponse.data).toHaveProperty('type')
      expect(mediaResponse.data.type).toBe('image')
    })

    it('should return error response for invalid image ID', async () => {
      const invalidImageId = 'invalid-image-id'
      
      const mediaResponse = await service.getProductMedia(invalidImageId)
      
      expect(mediaResponse).toHaveProperty('data')
      expect(mediaResponse).toHaveProperty('success')
      expect(mediaResponse).toHaveProperty('error')
      expect(mediaResponse.success).toBe(false)
      expect(mediaResponse.error).toBe('Media not found')
      expect(mediaResponse.data.url).toBe('')
    })

    it('should return media response with metadata when available', async () => {
      const products = await service.getProducts()
      const validImageId = products[0].image_id
      
      const mediaResponse = await service.getProductMedia(validImageId)
      
      if (mediaResponse.success && mediaResponse.data.metadata) {
        expect(mediaResponse.data.metadata).toHaveProperty('alt')
        expect(mediaResponse.data.metadata).toHaveProperty('width')
        expect(mediaResponse.data.metadata).toHaveProperty('height')
        expect(typeof mediaResponse.data.metadata.alt).toBe('string')
        expect(typeof mediaResponse.data.metadata.width).toBe('number')
        expect(typeof mediaResponse.data.metadata.height).toBe('number')
      }
    })

    it('should simulate network delay', async () => {
      const products = await service.getProducts()
      const validImageId = products[0].image_id
      
      const startTime = Date.now()
      await service.getProductMedia(validImageId)
      const endTime = Date.now()
      
      // Should take at least 100ms (allowing for some variance)
      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })
  })

  describe('Singleton pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = MockProductService.getInstance()
      const instance2 = MockProductService.getInstance()
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('Error handling scenarios', () => {
    it('should handle concurrent requests properly', async () => {
      const products = await service.getProducts()
      const validId = products[0].id
      
      // Make multiple concurrent requests
      const promises = [
        service.getProduct(validId),
        service.getProduct('invalid-id'),
        service.getProducts(),
        service.getProductMedia(products[0].image_id),
        service.getProductMedia('invalid-image-id')
      ]
      
      const results = await Promise.all(promises)
      
      expect(results[0]).not.toBeNull() // Valid product
      expect(results[1]).toBeNull() // Invalid product
      expect(Array.isArray(results[2])).toBe(true) // Products array
      expect((results[3] as any).success).toBe(true) // Valid media
      expect((results[4] as any).success).toBe(false) // Invalid media
    })

    it('should maintain data consistency across multiple calls', async () => {
      const products1 = await service.getProducts()
      const products2 = await service.getProducts()
      
      expect(products1.length).toBe(products2.length)
      
      // Check that all products have consistent IDs
      products1.forEach((product, index) => {
        expect(product.id).toBe(products2[index].id)
        expect(product.name).toBe(products2[index].name)
      })
    })

    it('should handle special characters in product ID search', async () => {
      const specialIds = [
        'prod-001!',
        'prod@001',
        'prod#001',
        'prod$001',
        'prod%001'
      ]
      
      for (const id of specialIds) {
        const product = await service.getProduct(id)
        expect(product).toBeNull()
      }
    })
  })
})