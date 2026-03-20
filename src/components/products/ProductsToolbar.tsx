import { Button, Space } from 'antd'
import { ArrowDownAZ, ArrowUpAZ, Plus, RefreshCcw } from 'lucide-react'

interface ProductsToolbarProps {
  currentOrder?: 'asc' | 'desc'
  onRefresh: () => void
  onSortChange: (order: 'asc' | 'desc') => void
  onAdd: () => void
}

export function ProductsToolbar({
  currentOrder,
  onRefresh,
  onSortChange,
  onAdd,
}: ProductsToolbarProps) {
  return (
    <div className="products-toolbar">
      <h2>Все позиции</h2>

      <Space size={12} wrap>
        <Button
          className="toolbar-icon-button"
          type="default"
          icon={<RefreshCcw size={16} />}
          onClick={onRefresh}
          aria-label="Обновить"
        />
        <Button
          className={
            currentOrder === 'asc' ? 'toolbar-icon-button is-active' : 'toolbar-icon-button'
          }
          type="default"
          icon={<ArrowUpAZ size={16} />}
          onClick={() => onSortChange('asc')}
          aria-label="Сортировать по возрастанию"
        />
        <Button
          className={
            currentOrder === 'desc' ? 'toolbar-icon-button is-active' : 'toolbar-icon-button'
          }
          type="default"
          icon={<ArrowDownAZ size={16} />}
          onClick={() => onSortChange('desc')}
          aria-label="Сортировать по убыванию"
        />
        <Button type="primary" icon={<Plus size={16} />} onClick={onAdd}>
          Добавить
        </Button>
      </Space>
    </div>
  )
}
