import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddProductModal } from '@/components/products/AddProductModal'

describe('AddProductModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
  }

  it('should render form fields when open', () => {
    render(<AddProductModal {...defaultProps} />)

    expect(screen.getByLabelText(/наименование/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/цена/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/вендор/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/артикул/i)).toBeInTheDocument()
  })

  it('should not render form when closed', () => {
    render(<AddProductModal {...defaultProps} open={false} />)

    expect(screen.queryByLabelText(/наименование/i)).not.toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /добавить/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('should call onSubmit with form data on valid submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AddProductModal {...defaultProps} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/наименование/i), 'Test Product')
    await user.type(screen.getByLabelText(/цена/i), '99.99')
    await user.type(screen.getByLabelText(/вендор/i), 'TestBrand')
    await user.type(screen.getByLabelText(/артикул/i), 'SKU-001')
    await user.click(screen.getByRole('button', { name: /добавить/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Test Product',
        price: 99.99,
        brand: 'TestBrand',
        sku: 'SKU-001',
      })
    })
  })

  it('should call onClose after successful submit', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AddProductModal {...defaultProps} onClose={onClose} />)

    await user.type(screen.getByLabelText(/наименование/i), 'Test Product')
    await user.type(screen.getByLabelText(/цена/i), '99.99')
    await user.type(screen.getByLabelText(/вендор/i), 'TestBrand')
    await user.type(screen.getByLabelText(/артикул/i), 'SKU-001')
    await user.click(screen.getByRole('button', { name: /добавить/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
