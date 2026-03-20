import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductsToolbar } from '@/components/products/ProductsToolbar'

const defaultProps = {
  currentOrder: undefined as 'asc' | 'desc' | undefined,
  onRefresh: vi.fn(),
  onSortChange: vi.fn(),
  onAdd: vi.fn(),
}

describe('ProductsToolbar', () => {
  it('should render "Все позиции" heading', () => {
    render(<ProductsToolbar {...defaultProps} />)
    expect(screen.getByText('Все позиции')).toBeInTheDocument()
  })

  it('should render refresh button', () => {
    render(<ProductsToolbar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /обновить/i })).toBeInTheDocument()
  })

  it('should render sort ascending and descending buttons', () => {
    render(<ProductsToolbar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /по возрастанию/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /по убыванию/i })).toBeInTheDocument()
  })

  it('should render "Добавить" button', () => {
    render(<ProductsToolbar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument()
  })

  it('should call onRefresh when refresh button is clicked', async () => {
    const onRefresh = vi.fn()
    const user = userEvent.setup()
    render(<ProductsToolbar {...defaultProps} onRefresh={onRefresh} />)

    await user.click(screen.getByRole('button', { name: /обновить/i }))
    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it('should call onSortChange with "asc" when sort ascending is clicked', async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(<ProductsToolbar {...defaultProps} onSortChange={onSortChange} />)

    await user.click(screen.getByRole('button', { name: /по возрастанию/i }))
    expect(onSortChange).toHaveBeenCalledWith('asc')
  })

  it('should call onSortChange with "desc" when sort descending is clicked', async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(<ProductsToolbar {...defaultProps} onSortChange={onSortChange} />)

    await user.click(screen.getByRole('button', { name: /по убыванию/i }))
    expect(onSortChange).toHaveBeenCalledWith('desc')
  })

  it('should call onAdd when "Добавить" button is clicked', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ProductsToolbar {...defaultProps} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /добавить/i }))
    expect(onAdd).toHaveBeenCalledOnce()
  })
})
