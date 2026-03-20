import { z } from 'zod/v4'

export const loginSchema = z.object({
  username: z.string().min(1, 'Поле обязательно для заполнения'),
  password: z.string().min(1, 'Поле обязательно для заполнения'),
})

export type LoginFormData = z.infer<typeof loginSchema>
