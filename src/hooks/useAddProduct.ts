import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addProduct } from '@/api/products.api'
import type { AddProductRequest } from '@/types/product.types'

export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddProductRequest) => addProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
