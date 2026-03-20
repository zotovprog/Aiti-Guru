import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { AddProductModal } from '@/components/products/AddProductModal'
import { ProductsTable } from '@/components/products/ProductsTable'
import { ProductsToolbar } from '@/components/products/ProductsToolbar'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAddProduct } from '@/hooks/useAddProduct'
import { useProducts } from '@/hooks/useProducts'
import type { AddProductRequest, ProductsQueryParams } from '@/types/product.types'
import { PAGE_SIZE } from '@/utils/constants'

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string | undefined>('title')
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const skip = (currentPage - 1) * PAGE_SIZE
  const params: ProductsQueryParams = {
    limit: PAGE_SIZE,
    skip,
    ...(sortBy ? { sortBy } : {}),
    ...(order ? { order } : {}),
    ...(debouncedSearchQuery ? { q: debouncedSearchQuery } : {}),
  }

  const { data, isLoading, isFetching, refetch } = useProducts(params)
  const addProductMutation = useAddProduct()

  const products = data?.products ?? []
  const total = data?.total ?? 0
  const showingFrom = total === 0 ? 0 : skip + 1
  const showingTo = total === 0 ? 0 : Math.min(skip + products.length, total)

  const handleRefresh = () => {
    void refetch()
  }

  const handleToolbarSortChange = (nextOrder: 'asc' | 'desc') => {
    setCurrentPage(1)
    setSortBy((currentSortBy) => currentSortBy ?? 'title')
    setOrder(nextOrder)
  }

  const handleTableSortChange = (nextSortBy?: string, nextOrder?: 'asc' | 'desc') => {
    setCurrentPage(1)
    setSortBy(nextSortBy)
    setOrder(nextOrder)
  }

  const handleAddProduct = async (payload: AddProductRequest) => {
    try {
      await addProductMutation.mutateAsync(payload)
      toast.success(`Товар "${payload.title}" успешно добавлен`)
    } catch (error) {
      toast.error('Не удалось добавить товар')
      throw error
    }
  }

  const headerContent = (
    <div className="page-topbar">
      <h1 className="page-topbar__title">Товары</h1>

      <div className="search-shell">
        <label className="sr-only" htmlFor="products-search">
          Поиск товаров
        </label>
        <Search size={18} />
        <input
          id="products-search"
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setCurrentPage(1)
          }}
          placeholder="Найти"
        />
      </div>
    </div>
  )

  return (
    <AppLayout headerContent={headerContent}>
      <section className="products-page">
        <ProductsToolbar
          currentOrder={order}
          onRefresh={handleRefresh}
          onSortChange={handleToolbarSortChange}
          onAdd={() => setIsModalOpen(true)}
        />

        <ProductsTable
          products={products}
          loading={isLoading || isFetching}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          total={total}
          sortBy={sortBy}
          order={order}
          onPageChange={setCurrentPage}
          onSortChange={handleTableSortChange}
        />

        <div className="products-page__footer">
          <span>
            Показано {showingFrom}-{showingTo} из {total}
          </span>
        </div>
      </section>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </AppLayout>
  )
}
