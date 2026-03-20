import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { addProductSchema } from '@/schemas/product.schema'
import type { AddProductFormData } from '@/schemas/product.schema'
import type { AddProductRequest } from '@/types/product.types'

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AddProductRequest) => Promise<unknown> | unknown
}

export function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: '',
      brand: '',
      sku: '',
    },
  })

  if (!open) {
    return null
  }

  const submitHandler = handleSubmit(async (data) => {
    await onSubmit(data)
    reset()
    onClose()
  })

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Добавить товар">
      <div className="modal-card">
        <div className="modal-card__header">
          <div>
            <h2>Новый товар</h2>
            <p>Заполните основные данные о продукте.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onClose} aria-label="Закрыть">
            Закрыть
          </button>
        </div>

        <form className="admin-form" onSubmit={submitHandler} noValidate>
          <div className="form-field">
            <label htmlFor="title">Наименование</label>
            <input id="title" type="text" {...register('title')} />
            {errors.title ? <p role="alert">{errors.title.message}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="price">Цена</label>
            <input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
            {errors.price ? <p role="alert">{errors.price.message}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="brand">Вендор</label>
            <input id="brand" type="text" {...register('brand')} />
            {errors.brand ? <p role="alert">{errors.brand.message}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="sku">Артикул</label>
            <input id="sku" type="text" {...register('sku')} />
            {errors.sku ? <p role="alert">{errors.sku.message}</p> : null}
          </div>

          <div className="modal-card__footer">
            <button type="button" className="ghost-button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
