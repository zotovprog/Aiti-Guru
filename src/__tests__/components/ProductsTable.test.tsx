import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductsTable } from '@/components/products/ProductsTable'
import type { Product } from '@/types/product.types'

function createMockProduct(overrides: Partial<Product> & { id: number; title: string }): Product {
  return {
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: '',
    sku: '',
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: '',
    reviews: [],
    returnPolicy: '',
    minimumOrderQuantity: 1,
    meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
    images: [],
    thumbnail: '',
    tags: [],
    ...overrides,
  }
}

const mockProducts: Product[] = [
  createMockProduct({
    id: 1,
    title: 'Тестовый товар',
    category: 'Электроника',
    price: 1500,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'TestBrand',
    sku: 'SKU-001',
    thumbnail: 'https://example.com/thumb.jpg',
  }),
  createMockProduct({
    id: 2,
    title: 'Товар с низким рейтингом',
    category: 'Одежда',
    price: 300,
    discountPercentage: 5,
    rating: 3.2,
    stock: 10,
    brand: 'LowBrand',
    sku: 'SKU-002',
    thumbnail: 'https://example.com/thumb2.jpg',
  }),
]

const defaultProps = {
  products: mockProducts,
  loading: false,
  currentPage: 1,
  pageSize: 20,
  total: 2,
  sortBy: undefined as string | undefined,
  order: undefined as 'asc' | 'desc' | undefined,
  onPageChange: vi.fn(),
  onSortChange: vi.fn(),
}

describe('ProductsTable', () => {
  it('should render table column headers matching the mockup', () => {
    render(<ProductsTable {...defaultProps} />)

    expect(screen.getByText('Наименование')).toBeInTheDocument()
    expect(screen.getByText('Вендор')).toBeInTheDocument()
    expect(screen.getByText('Артикул')).toBeInTheDocument()
    expect(screen.getByText('Оценка')).toBeInTheDocument()
    expect(screen.getByText('Цена, ₽')).toBeInTheDocument()
    expect(screen.getByText('Количество')).toBeInTheDocument()
  })

  it('should render product data in rows', () => {
    render(<ProductsTable {...defaultProps} />)

    expect(screen.getByText('Тестовый товар')).toBeInTheDocument()
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
    expect(screen.getByText('SKU-001')).toBeInTheDocument()
  })

  it('should render "more" stub buttons (three dots) for each row', () => {
    render(<ProductsTable {...defaultProps} />)

    const moreButtons = screen.getAllByRole('button', { name: /ещё/i })
    expect(moreButtons).toHaveLength(mockProducts.length)
  })

  it('should render add buttons for each row', () => {
    render(<ProductsTable {...defaultProps} />)

    const addButtons = screen.getAllByRole('button', { name: /добавить/i })
    expect(addButtons).toHaveLength(mockProducts.length)
  })

  it('should show empty state when no products', () => {
    render(<ProductsTable {...defaultProps} products={[]} total={0} />)

    expect(screen.getByText('Товары не найдены')).toBeInTheDocument()
  })
})
