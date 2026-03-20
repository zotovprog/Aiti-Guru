import { Progress, Tooltip } from 'antd'

export function StockBar({ value }: { value: number }) {
  const percent = Math.min(100, (value / 200) * 100)
  return (
    <Tooltip title={`${value} шт.`}>
      <div>
        <Progress percent={percent} size="small" showInfo={false} />
      </div>
    </Tooltip>
  )
}
