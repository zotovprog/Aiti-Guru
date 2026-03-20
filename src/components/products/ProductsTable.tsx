import { useState } from 'react'
import { Space, Table } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'
import { MoreHorizontal, Plus } from 'lucide-react'
import { RatingCell } from '@/components/products/RatingCell'
import { StockBar } from '@/components/products/StockBar'
import type { Product } from '@/types/product.types'

interface ProductsTableProps {
  products: Product[]
  loading?: boolean
  currentPage: number
  pageSize: number
  total: number
  sortBy?: string
  order?: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (sortBy?: string, order?: 'asc' | 'desc') => void
}

function renderMissing() {
  return <span style={{ color: '#999' }}>Отсутствует</span>
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function toAntdSortOrder(order?: 'asc' | 'desc'): 'ascend' | 'descend' | null {
  if (order === 'asc') {
    return 'ascend'
  }

  if (order === 'desc') {
    return 'descend'
  }

  return null
}

export function ProductsTable({
  products,
  loading = false,
  currentPage,
  pageSize,
  total,
  sortBy,
  order,
  onPageChange,
  onSortChange,
}: ProductsTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([])
  const activeSortOrder = toAntdSortOrder(order)

  const columns: TableColumnsType<Product> = [
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortOrder: sortBy === 'title' ? activeSortOrder : null,
      render: (_value, record) => (
        <div className="product-cell">
          <img className="product-cell__thumb" src={record.thumbnail} alt={record.title} />
          <div className="product-cell__meta">
            <span className="product-cell__title">{record.title}</span>
            <span className="product-cell__category">{record.category}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Вендор',
      dataIndex: 'brand',
      key: 'brand',
      render: (value: string) => value || renderMissing(),
    },
    {
      title: 'Артикул',
      dataIndex: 'sku',
      key: 'sku',
      render: (value: string) => value || renderMissing(),
    },
    {
      title: 'Оценка',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      sortOrder: sortBy === 'rating' ? activeSortOrder : null,
      render: (value: number) => (
        <span className="products-table__rating">
          <RatingCell value={Number(value.toFixed(1))} />
          /5
        </span>
      ),
    },
    {
      title: 'Цена, ₽',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      sortOrder: sortBy === 'price' ? activeSortOrder : null,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Количество',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      sortOrder: sortBy === 'stock' ? activeSortOrder : null,
      render: (value: number) => <StockBar value={value} />,
    },
    {
      title: '',
      key: 'add',
      width: 48,
      render: () => (
        <button
          type="button"
          className="table-circle-button table-circle-button--add"
          aria-label="Добавить"
        >
          <Plus size={16} />
        </button>
      ),
    },
    {
      title: '',
      key: 'more',
      width: 48,
      render: () => (
        <button
          type="button"
          className="table-circle-button table-circle-button--more"
          aria-label="Ещё"
        >
          <MoreHorizontal size={16} />
        </button>
      ),
    },
  ]

  const handleTableChange: TableProps<Product>['onChange'] = (
    pagination,
    _filters,
    sorter,
    extra,
  ) => {
    if (pagination.current && pagination.current !== currentPage) {
      onPageChange(pagination.current)
    }

    if (extra.action !== 'sort') {
      return
    }

    const nextSorter = Array.isArray(sorter) ? sorter[0] : sorter
    const nextSortBy = typeof nextSorter?.field === 'string' ? nextSorter.field : undefined
    const nextOrder =
      nextSorter?.order === 'ascend' ? 'asc' : nextSorter?.order === 'descend' ? 'desc' : undefined

    onSortChange(nextSortBy, nextOrder)
  }

  return (
    <div className="products-table">
      <Table<Product>
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as Array<string | number>),
        }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
          placement: ['bottomEnd'],
        }}
        locale={{
          emptyText: (
            <Space orientation="vertical" size={4}>
              <span>Товары не найдены</span>
              <span className="muted-text">Попробуйте изменить поиск или сортировку.</span>
            </Space>
          ),
        }}
      />
    </div>
  )
}
