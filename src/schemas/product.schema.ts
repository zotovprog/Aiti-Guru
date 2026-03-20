import { z } from 'zod/v4'

export const addProductSchema = z.object({
  title: z.string().min(1, 'Наименование обязательно'),
  price: z.coerce.number().positive('Цена должна быть положительной'),
  brand: z.string().min(1, 'Вендор обязателен'),
  sku: z.string().min(1, 'Артикул обязателен'),
})

export type AddProductFormData = z.infer<typeof addProductSchema>
