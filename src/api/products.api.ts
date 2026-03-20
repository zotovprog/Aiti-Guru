import { apiClient } from './axios'
import type {
  ProductsResponse,
  ProductsQueryParams,
  AddProductRequest,
  Product,
} from '@/types/product.types'

export async function getProducts(params?: ProductsQueryParams): Promise<ProductsResponse> {
  const { q, ...rest } = params || {}

  if (q) {
    return searchProducts(q, rest)
  }

  const response = await apiClient.get<ProductsResponse>('/products', { params: rest })
  return response.data
}

export async function searchProducts(
  query: string,
  params?: Omit<ProductsQueryParams, 'q'>,
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products/search', {
    params: { q: query, ...params },
  })
  return response.data
}

export async function addProduct(data: AddProductRequest): Promise<Product> {
  const response = await apiClient.post<Product>('/products/add', data)
  return response.data
}
