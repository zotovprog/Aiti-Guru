import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/api/products.api'
import type { ProductsQueryParams } from '@/types/product.types'

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
}
